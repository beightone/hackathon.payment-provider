import {
  AuthorizationRequest,
  AuthorizationResponse,
  CancellationRequest,
  CancellationResponse,
  Cancellations,
  PaymentProvider,
  RefundRequest,
  RefundResponse,
  Refunds,
  SettlementRequest,
  SettlementResponse,
} from '@vtex/payment-provider'

import { randomString } from './utils'
import { Authorize } from './modules/vtex_services/authorize.service'
import { Clients } from './clients'
import { Configuration } from './modules/shared/configuration.service'
import { Settle } from './modules/vtex_services/settle.service'

export default class HackathonVTEXDay extends PaymentProvider<Clients> {
  // This class needs modifications to pass the test suit.
  // Refer to https://help.vtex.com/en/tutorial/payment-provider-protocol#4-testing
  // in order to learn about the protocol and make the according changes.

  public async authorize(
    authorization: AuthorizationRequest
  ): Promise<AuthorizationResponse> {
    const configClient = new Configuration(this.context)

    await configClient.saveToken(this.appToken)

    const authorize = new Authorize(this.context, authorization)

    const response = await authorize.execute()

    console.log('RESPONSE', response)

    return response
  }

  public async cancel(
    cancellation: CancellationRequest
  ): Promise<CancellationResponse> {
    if (this.isTestSuite) {
      return Cancellations.approve(cancellation, {
        cancellationId: randomString(),
      })
    }

    throw new Error('Not implemented')
  }

  public async refund(refund: RefundRequest): Promise<RefundResponse> {
    if (this.isTestSuite) {
      return Refunds.deny(refund)
    }

    throw new Error('Not implemented')
  }

  public async settle(
    settlement: SettlementRequest
  ): Promise<SettlementResponse> {
    const settleService = new Settle(this.context, settlement)

    return settleService.execute()
  }

  public inbound: undefined
}
