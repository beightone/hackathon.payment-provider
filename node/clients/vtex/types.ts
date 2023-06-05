export type VtexCallbackExecute = {
  paymentId: string
  tid: string
  authorizationId: string
  nsu: string
  status: 'approved' | 'denied' | 'undefined'
  code: string
  message: string
  delayToAutoSettle: number
}

export interface VtexCallbackUrlData {
  transactionId: string | string[]
  paymentId: string | string[]
  account: string | string[]
}
