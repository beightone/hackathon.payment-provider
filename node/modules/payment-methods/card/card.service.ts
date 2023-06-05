import { ServiceContext } from '@vtex/api'
import {
  Address,
  AuthorizationRequest,
  CardAuthorization,
  TokenizedCard,
} from '@vtex/payment-provider'

import { Clients } from '../../../clients'
import { CustomLogger } from '../../../utils/logger'

const TOKEN =
  'sk_test_51HgW2AJaRKWlKpKLlNiukm6KWUnmZNFVK6sdtcHNgaoJt8zvHQ7o6kNjlBO1OGGEaqj5t4Y9c4XgTjvb5xgIItWc008Hlagxgq'

export class Card {
  private ctx: ServiceContext<Clients>
  private authorization: AuthorizationRequest
  private logger: CustomLogger

  constructor(
    ctx: ServiceContext<Clients>,
    authorization: AuthorizationRequest
  ) {
    this.ctx = ctx
    this.authorization = authorization
    this.logger = new CustomLogger(this.ctx.vtex.logger)
  }

  private async createPaymentMethod() {
    const { clients } = this.ctx

    const { card, secureProxyUrl } = this.authorization as CardAuthorization

    const {
      cscToken: cvc,
      expiration: { month, year },
      numberToken: number,
    } = card as TokenizedCard

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
        TOKEN,
        secureProxyUrl as string
      )

      this.logger.info('CREATE_CARD_PAYMENT_METHOD_RESPONSE:', response)

      return response
    } catch (err) {
      this.logger.error('CREATE_CARD_PAYMENT_METHOD', err)
    }

    return { id: null }
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

    try {
      const response = await clients
        .stripeClient()
        .createCustomer(formBody.join('&'), TOKEN)

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

    try {
      const { id } = await this.createPaymentMethod()

      const { id: customer } = await this.createCustomer()

      if (!id || !customer) {
        throw new Error('Error creating payment method or customer')
      }

      const response = await clients.stripeClient().createPaymentIntent(
        {
          amount: Math.floor(value * 100),
          currency,
          confirm: true,
          payment_method: id,
          customer,
        },
        TOKEN
      )

      this.logger.info('CREATE_CARD_INTENT_RESPONSE', response)
    } catch (err) {
      this.logger.error('CREATE_CARD_INTENT', err)
    }

    // console.log(this.authorization)
  }

  public async create() {
    await this.createPaymentIntent()
  }
}
