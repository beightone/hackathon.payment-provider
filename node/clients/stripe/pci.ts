import { SecureExternalClient } from '@vtex/payment-provider'
import { IOContext, InstanceOptions, RequestConfig } from '@vtex/api'

import {
  CreatePaymentMethodRequest,
  CreatePaymentMethodResponse,
} from './types'

const VERSION = 'v1'

export default class StripePCICertifiedClient extends SecureExternalClient {
  constructor(protected context: IOContext, options?: InstanceOptions) {
    super('http://api.stripe.com', context, {
      ...options,
      timeout: 10 * 1000,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public createPaymentMethod(
    data: CreatePaymentMethodRequest,
    token: string,
    secureProxy: string
  ): Promise<CreatePaymentMethodResponse> {
    return this.http.post(
      `/${VERSION}/payment_methods`,
      `type=${data.type}&card[number]=${data.card.number}&card[exp_month]=${data.card.exp_month}&card[exp_year]=${data.card.exp_year}&card[cvc]=${data.card.cvc}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        secureProxy,
      } as RequestConfig
    )
  }
}
