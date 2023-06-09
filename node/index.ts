import { LRUCache, ServiceContext, method } from '@vtex/api'
import { PaymentProviderService } from '@vtex/payment-provider'

import HackathonVTEXDay from './connector'
import { Clients } from './clients'
import { checkPayment } from './middlewares/check-async-payment'

const TIMEOUT_MS = 10000

const memoryCache = new LRUCache<string, any>({ max: 100 })

metrics.trackCache('status', memoryCache)

const clients: any = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    status: {
      memoryCache,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients>
}

export default new PaymentProviderService({
  clients,
  connector: HackathonVTEXDay,
  routes: {
    asyncPaymentConclusion: method({
      POST: [checkPayment],
    }),
  },
})
