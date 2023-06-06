import { ServiceContext } from '@vtex/api'
import {
  Address,
  AuthorizationRequest,
  Authorizations,
  CardAuthorization,
  TokenizedCard,
} from '@vtex/payment-provider'

import { Clients } from '../../../clients'
import { CustomLogger } from '../../../utils/logger'
import { Configuration } from '../../shared/configuration.service'

export class Card {
  private ctx: ServiceContext<Clients>
  private authorization: AuthorizationRequest
  private logger: CustomLogger
  private configClient: Configuration

  constructor(
    ctx: ServiceContext<Clients>,
    authorization: AuthorizationRequest
  ) {
    this.ctx = ctx
    this.authorization = authorization
    this.logger = new CustomLogger(this.ctx.vtex.logger)
    this.configClient = new Configuration(ctx)
  }

  private async createPaymentMethod() {
    const { clients } = this.ctx

    const { card, secureProxyUrl } = this.authorization as CardAuthorization

    const {
      cscToken: cvc,
      expiration: { month, year },
      numberToken: number,
    } = card as TokenizedCard

    const token = await this.configClient.getToken()

    try {
      const response = await clients.stripePCIClient().createPaymentMethod(
        {
          type: 'card',
          card: {
            number,
            cvc,
            exp_month: parseInt(month, 10),
            exp_year: parseInt(year, 10),
          },
        },
        token,
        secureProxyUrl as string
      )

      this.logger.info('CREATE_CARD_PAYMENT_METHOD_RESPONSE:', response)

      return { ...response, code: '200' }
    } catch (err) {
      this.logger.error('CREATE_CARD_PAYMENT_METHOD', err)
    }

    return { id: null, code: '402' }
  }

  private async createCustomer() {
    const { clients } = this.ctx

    const {
      miniCart: {
        buyer: { email, phone, firstName, lastName },
        billingAddress,
      },
    } = this.authorization

    const {
      city,
      country,
      street,
      postalCode,
      state,
    } = billingAddress as Address

    const formBody: any = []

    formBody.push(`address[city]=${city}`)
    formBody.push(`address[country]=${country}`)
    formBody.push(`address[line1]=${street}`)
    formBody.push(`address[postal_code]=${postalCode}`)
    formBody.push(`address[state]=${state}`)
    formBody.push(`email=${email}`)
    formBody.push(`phone=${phone}`)
    formBody.push(`name=${firstName} ${lastName}`)

    const token = await this.configClient.getToken()

    try {
      const response = await clients
        .stripeClient()
        .createCustomer(formBody.join('&'), token)

      this.logger.info('CREATE_CARD_CUSTOMER_RESPONSE', response)

      return response
    } catch (err) {
      this.logger.error('CREATE_CARD_CUSTOMER_ERROR', err)
    }

    return { id: null }
  }

  private async createPaymentIntent() {
    const { value, currency } = this.authorization

    const { clients } = this.ctx

    const token = await this.configClient.getToken()

    try {
      const { id, code } = await this.createPaymentMethod()

      if (!id) {
        return Authorizations.deny(this.authorization, {
          message: 'Card refused',
          code,
        })
      }

      const { id: customer } = await this.createCustomer()

      const response = await clients.stripeClient().createPaymentIntent(
        {
          amount: Math.floor(value * 100),
          currency,
          confirm: true,
          payment_method: id,
          customer,
        },
        token
      )

      this.logger.info('CREATE_CARD_INTENT_RESPONSE', response)

      const delayToAutoSettle = await this.configClient.getCaptureDelay()

      return Authorizations.approve(this.authorization, {
        tid: response.id,
        authorizationId: response.charges.data[0].id,
        message: 'Approved by acquirer',
        code: '200',
        delayToAutoSettle,
      })
    } catch (err) {
      this.logger.error('CREATE_CARD_INTENT', err)

      return Authorizations.deny(this.authorization, {
        message: 'Card refused',
        code: '400',
      })
    }
  }

  public async create() {
    const response = await this.createPaymentIntent()

    return response
  }
}
