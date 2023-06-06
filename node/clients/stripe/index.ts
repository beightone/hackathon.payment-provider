import { ExternalClient } from '@vtex/api'

import {
  CreateCustomerResponse,
  CreatePaymentIntenteRequest,
  MakeTransferRequest,
} from './types'
import { PaymentIntent } from './payment-intent'

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

  public getPaymentIntent(
    intentId: string,
    token: string
  ): Promise<PaymentIntent> {
    return this.http.get(`/${VERSION}/payment_intents/${intentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  public createPaymentIntent(
    data: CreatePaymentIntenteRequest,
    token: string
  ): Promise<PaymentIntent> {
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

  public transfer(
    data: MakeTransferRequest,
    token: string
  ): Promise<CreateCustomerResponse> {
    console.log(data)

    return this.http.post(`/${VERSION}/transfers`, this.getFormaData(data), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
}
