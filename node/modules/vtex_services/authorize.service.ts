import { IOClients, ParamsContext, ServiceContext } from '@vtex/api'
import {
  AuthorizationRequest,
  PaymentProviderState,
} from '@vtex/payment-provider'

export class Authorize<
  ClientsT extends IOClients = IOClients,
  StateT extends PaymentProviderState = PaymentProviderState,
  CustomT extends ParamsContext = ParamsContext
> {
  private ctx: ServiceContext<ClientsT, StateT, CustomT>
  private authorization: AuthorizationRequest

  constructor(
    ctx: ServiceContext<ClientsT, StateT, CustomT>,
    authorization: AuthorizationRequest
  ) {
    this.ctx = ctx
    this.authorization = authorization

    console.log(this.ctx, this.authorization)
  }

  public execute() {
    console.log('Authorize')
  }
}
