import { ServiceContext } from '@vtex/api'
import { AuthorizationRequest, Authorizations } from '@vtex/payment-provider'

import { Clients } from '../../clients'
import { Card } from '../payment-methods/card/card.service'
import PaymentsRepository from '../shared/repositories/payments'
import { Configuration } from '../shared/configuration.service'
import { PaymentIntent } from '../../clients/stripe/payment-intent'

export class Authorize {
  private ctx: ServiceContext<Clients>
  private authorization: AuthorizationRequest
  private repository: PaymentsRepository
  private configClient: Configuration

  constructor(
    ctx: ServiceContext<Clients>,
    authorization: AuthorizationRequest
  ) {
    this.ctx = ctx
    this.authorization = authorization
    this.configClient = new Configuration(ctx)
    this.repository = new PaymentsRepository(
      this.ctx.clients.paymentsMasterdataClient()
    )
  }

  private async isPaymentCreated() {
    const { clients } = this.ctx

    try {
      const paymentData = await this.repository.getPaymentById(
        this.authorization.paymentId
      )

      if (!paymentData) {
        return null
      }

      const token = await this.configClient.getToken()

      const pamentIntent = await clients
        .stripeClient()
        .getPaymentIntent(paymentData.remoteId, token)

      return pamentIntent
    } catch (err) {
      console.log('ERROR', err)

      return null
    }
  }

  private async resolvePaymentIntent(paymentIntent: PaymentIntent) {
    const delayToAutoSettle = await this.configClient.getCaptureDelay()

    switch (paymentIntent.status) {
      case 'succeeded': {
        return Authorizations.approve(this.authorization, {
          message: ' Payment Approved by acquirer',
          code: '200',
          tid: paymentIntent.id,
          authorizationId: paymentIntent.charges.data[0].id,
          delayToAutoSettle,
        })
      }

      case 'processing': {
        return Authorizations.pending(this.authorization, {
          message: paymentIntent.cancellation_reason,
          code: '400',
          tid: paymentIntent.id,
          authorizationId: paymentIntent.charges.data[0].id,
          delayToCancel: 2 * 24 * 60 * 60,
        })
      }

      case 'canceled': {
        return Authorizations.deny(this.authorization, {
          message: paymentIntent.cancellation_reason,
          code: '400',
          tid: paymentIntent.id,
          authorizationId: paymentIntent.charges.data[0].id,
        })
      }

      default: {
        return Authorizations.deny(this.authorization, {
          message: paymentIntent.cancellation_reason,
          code: '400',
          tid: paymentIntent.id,
          authorizationId: paymentIntent.charges.data[0].id,
        })
      }
    }
  }

  public async execute() {
    const { paymentMethod } = this.authorization

    const paymentIntent = await this.isPaymentCreated()

    if (paymentIntent) {
      const resolveResponse = await this.resolvePaymentIntent(paymentIntent)

      return resolveResponse
    }

    switch (paymentMethod) {
      case 'Visa': {
        const cardClient = new Card(this.ctx, this.authorization)

        const response = await cardClient.create()

        return response
      }

      default:
        throw new Error('Payment not Implemented')
    }
  }
}
