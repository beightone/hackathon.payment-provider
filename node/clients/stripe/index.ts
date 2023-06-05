import { ExternalClient } from '@vtex/api'

import { CreateCustomerResponse, CreatePaymentIntenteRequest } from './types'

const VERSION = 'v1'

export default class StripeService extends ExternalClient {
  constructor(protected context: any, options?: any) {
    super('http://api.stripe.com', context, {
      ...options,
      timeout: 10000,
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        VtexIdclientAutCookie: context.authToken,
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  private getFormaData(data: any) {
    //@ts-expect-error
    return new URLSearchParams(data).toString()
  }

  public createPaymentIntent(data: CreatePaymentIntenteRequest, token: string) {
    return this.http.post(
      `/${VERSION}/payment_intents`,
      this.getFormaData(data),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  }

  public createCustomer(
    data: string,
    token: string
  ): Promise<CreateCustomerResponse> {
    return this.http.post(`/${VERSION}/customers`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
}
