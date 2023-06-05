import { ServiceContext } from '@vtex/api'
import { SettlementRequest } from '@vtex/payment-provider'

import { Clients } from '../../clients'

export class Refund {
  private ctx: ServiceContext<Clients>
  private settlement: SettlementRequest

  constructor(ctx: ServiceContext<Clients>, settlement: SettlementRequest) {
    this.ctx = ctx
    this.settlement = settlement

    console.info(this.ctx, this.settlement)
  }
}
