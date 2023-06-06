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
import PaymentsRepository from '../../shared/repositories/payments'
import { PaymentStatus } from '../../shared/repositories/payments/types'
import { PaymentIntent } from '../../../clients/stripe/payment-intent'

export class Card {
  private ctx: ServiceContext<Clients>
  private authorization: AuthorizationRequest
  private logger: CustomLogger
  private configClient: Configuration
  private repository: PaymentsRepository

  constructor(
    ctx: ServiceContext<Clients>,
    authorization: AuthorizationRequest
  ) {
    this.ctx = ctx
    this.authorization = authorization
    this.logger = new CustomLogger(this.ctx.vtex.logger)
    this.configClient = new Configuration(ctx)
    this.repository = new PaymentsRepository(
      this.ctx.clients.paymentsMasterdataClient()
    )
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

      this.logger.info('CREATE_CARD_PAYMENT_METHOD_RESPONSE:', response.id)

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

      this.logger.info('CREATE_CARD_CUSTOMER_RESPONSE', response.id)

      return response
    } catch (err) {
      this.logger.error('CREATE_CARD_CUSTOMER_ERROR', err)
    }

    return { id: null }
  }

  private async checkPayment(paymentIntent: PaymentIntent) {
    const delayToAutoSettle = await this.configClient.getCaptureDelay()

    const { id: tid, client_secret } = paymentIntent

    const token = await this.configClient.getToken()

    switch (paymentIntent.status) {
      case 'succeeded': {
        return Authorizations.approve(this.authorization, {
          tid,
          authorizationId: paymentIntent.charges.data[0].id,
          message: 'Approved by acquirer',
          code: '200',
          acquirer: 'Stripe',
          delayToAutoSettle,
        })
      }

      case 'requires_action': {
        this.logger.info('CARD_REDIRECT', {})

        return Authorizations.pending(this.authorization, {
          tid,
          code: '201',
          message: 'The customer needs to finish the payment flow',
          paymentAppData: {
            appName: `${process.env.VTEX_APP_VENDOR}.${process.env.VTEX_APP_NAME}`,
            payload: JSON.stringify({ client_secret, token }),
          },
          delayToAutoSettle,
          acquirer: 'Stripe',
          delayToCancel: 2 * 24 * 60 * 60,
        })
      }

      case 'canceled': {
        return Authorizations.deny(this.authorization, {
          tid,
          message: paymentIntent.cancellation_reason,
          code: '400',
          acquirer: 'Stripe',
        })
      }

      default:
        return Authorizations.pending(this.authorization, {
          message: 'Status was not defined',
          code: '200',
          acquirer: 'Stripe',
          delayToAutoSettle,
          delayToCancel: 2 * 24 * 60 * 60,
        })
    }
  }

  private async createPaymentIntent() {
    const {
      value,
      currency,
      orderId,
      paymentId,
      transactionId,
    } = this.authorization

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

      const paymentIntent = await clients.stripeClient().createPaymentIntent(
        {
          amount: Math.floor(value * 100),
          currency,
          confirm: true,
          payment_method: id,
          customer,
          transfer_group: orderId,
        },
        token
      )

      this.logger.info('CREATE_CARD_INTENT_RESPONSE', paymentIntent.id)

      this.repository.savePayment({
        orderId,
        transactionId,
        paymentId,
        status: PaymentStatus.AUTHORIZED,
        remoteId: paymentIntent.id,
      })

      return this.checkPayment(paymentIntent)
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
