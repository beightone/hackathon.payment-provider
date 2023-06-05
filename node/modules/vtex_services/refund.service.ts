import { ServiceContext } from '@vtex/api'
import { RefundRequest } from '@vtex/payment-provider'

import { Clients } from '../../clients'

export class Refund {
  private ctx: ServiceContext<Clients>
  private refund: RefundRequest

  constructor(ctx: ServiceContext<Clients>, refund: RefundRequest) {
    this.ctx = ctx
    this.refund = refund

    console.info(this.ctx, this.refund)
  }
}
