import { SecureExternalClient } from '@vtex/payment-provider'

export default class StripePCICertifiedClient extends SecureExternalClient {
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
}
