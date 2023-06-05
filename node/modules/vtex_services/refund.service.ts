import { IOClients, ParamsContext, ServiceContext } from '@vtex/api'
import { RefundRequest, PaymentProviderState } from '@vtex/payment-provider'

export class Refund<
  ClientsT extends IOClients = IOClients,
  StateT extends PaymentProviderState = PaymentProviderState,
  CustomT extends ParamsContext = ParamsContext
> {
  private ctx: ServiceContext<ClientsT, StateT, CustomT>
  private refund: RefundRequest

  constructor(
    ctx: ServiceContext<ClientsT, StateT, CustomT>,
    refund: RefundRequest
  ) {
    this.ctx = ctx
    this.refund = refund

    console.info(this.ctx, this.refund)
  }
}
