import { IOClients, ParamsContext, ServiceContext } from '@vtex/api'
import { PaymentProviderState, SettlementRequest } from '@vtex/payment-provider'

export class Refund<
  ClientsT extends IOClients = IOClients,
  StateT extends PaymentProviderState = PaymentProviderState,
  CustomT extends ParamsContext = ParamsContext
> {
  private ctx: ServiceContext<ClientsT, StateT, CustomT>
  private settlement: SettlementRequest

  constructor(
    ctx: ServiceContext<ClientsT, StateT, CustomT>,
    settlement: SettlementRequest
  ) {
    this.ctx = ctx
    this.settlement = settlement

    console.info(this.ctx, this.settlement)
  }
}
