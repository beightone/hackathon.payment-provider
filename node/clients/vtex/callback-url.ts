import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

import { VtexCallbackExecute, VtexCallbackUrlData } from './types'

export default class VtexCallbackUrl extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.account}.vtexpayments.com.br/api/pvt/`, context, {
      ...options,
      timeout: 5000,
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        VtexIdclientAutCookie: context.authToken,
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public execute(
    { transactionId, paymentId, account }: VtexCallbackUrlData,
    data: VtexCallbackExecute
  ) {
    const callbackUrl = `payment-provider/transactions/${transactionId}/payments/${paymentId}/callback?accountName=${account}`

    return this.http.post(
      callbackUrl,
      {
        ...data,
      },
      {
        metric: 'VtexCallbackUrl-execute',
      }
    )
  }

  public cancel(transactionId: string, value: number) {
    const callbackUrl = `transactions/${transactionId}/cancellation-request
    `

    return this.http.post(
      callbackUrl,
      {
        value,
      },
      {
        metric: 'VtexCallbackUrl-cancel',
      }
    )
  }

  public settle(transactionId: string, value: number) {
    const callbackUrl = `transactions/${transactionId}/settlement-request
    `

    return this.http.post(
      callbackUrl,
      {
        value,
      },
      {
        metric: 'VtexCallbackUrl-settle',
      }
    )
  }

  public refund(transactionId: string, value: number) {
    const callbackUrl = `transactions/${transactionId}/cancellation-request
    `

    return this.http.post(
      callbackUrl,
      {
        value,
      },
      {
        metric: 'VtexCallbackUrl-cancel',
      }
    )
  }
}
