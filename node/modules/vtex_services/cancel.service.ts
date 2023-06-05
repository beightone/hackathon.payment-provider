import { IOClients, ParamsContext, ServiceContext } from '@vtex/api'
import {
  CancellationRequest,
  PaymentProviderState,
} from '@vtex/payment-provider'

export class Cancel<
  ClientsT extends IOClients = IOClients,
  StateT extends PaymentProviderState = PaymentProviderState,
  CustomT extends ParamsContext = ParamsContext
> {
  private ctx: ServiceContext<ClientsT, StateT, CustomT>
  private cancellation: CancellationRequest

  constructor(
    ctx: ServiceContext<ClientsT, StateT, CustomT>,
    cancellation: CancellationRequest
  ) {
    this.ctx = ctx
    this.cancellation = cancellation

    console.info(this.ctx, this.cancellation)
  }
}
