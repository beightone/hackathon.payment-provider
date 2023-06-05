import { ServiceContext } from '@vtex/api'
import { CancellationRequest } from '@vtex/payment-provider'

import { Clients } from '../../clients'

export class Cancel {
  private ctx: ServiceContext<Clients>
  private cancellation: CancellationRequest

  constructor(ctx: ServiceContext<Clients>, cancellation: CancellationRequest) {
    this.ctx = ctx
    this.cancellation = cancellation

    console.info(this.ctx, this.cancellation)
  }
}
