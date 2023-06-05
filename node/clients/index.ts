import { IOClients } from '@vtex/api'

import VtexCallbackUrl from './vtex/callback-url'
import StripePCICertifiedClient from './stripe/pci'
import StripeService from './stripe'

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
}
