import { ServiceContext } from '@vtex/api'
import { AuthorizationRequest } from '@vtex/payment-provider'

import { Clients } from '../../clients'
import { Card } from '../payment-methods/card/card.service'

export class Authorize {
  private ctx: ServiceContext<Clients>
  private authorization: AuthorizationRequest

  constructor(
    ctx: ServiceContext<Clients>,
    authorization: AuthorizationRequest
  ) {
    this.ctx = ctx
    this.authorization = authorization

    console.log(this.ctx, this.authorization)
  }

  private isPaymentCreated() {
    console.log('checkpayment')
  }

  public async execute() {
    const { paymentMethod } = this.authorization

    this.isPaymentCreated()

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
