import { IOClients } from '@vtex/api'

import VtexCallbackUrl from './vtex/callback-url'
import StripePCICertifiedClient from './stripe/pci'
import StripeService from './stripe'
import PaymentsMasterdataClient from './vtex/payments-masterdata'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public vtexCallBackClient() {
    return this.getOrSet('vtexCallBackClient', VtexCallbackUrl)
  }

  public stripePCIClient() {
    return this.getOrSet('stripePCIClient', StripePCICertifiedClient)
  }

  public stripeClient() {
    return this.getOrSet('stripeClient', StripeService)
  }

  public paymentsMasterdataClient() {
    return this.getOrSet('paymentsMasterdataClient', PaymentsMasterdataClient)
  }
}
