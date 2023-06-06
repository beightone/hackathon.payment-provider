export enum PaymentStatus {
  'STARTED' = 'STARTED',
  'AUTHORIZED' = 'AUTHORIZED',
  'CONCLUDED' = 'CONCLUDED',
  'CANCELED' = 'CANCELED',
}

export enum RemoteStatusDictionary {
  'NEW_PAYMENT' = PaymentStatus.STARTED,
  'BANK_REDIRECT' = PaymentStatus.STARTED,
  'AUTHORISED_BY_USER' = PaymentStatus.AUTHORIZED,
  'COMPLETED' = PaymentStatus.AUTHORIZED,
  'RECEIVED' = PaymentStatus.CONCLUDED,
  'APPROVED_BY_RISK' = PaymentStatus.STARTED,
  'DELAYED_AT_BANK' = PaymentStatus.STARTED,
  'REFUSED_BY_RISK' = PaymentStatus.CANCELED,
  'ERROR_AT_BANK' = PaymentStatus.CANCELED,
  'REFUSED_BY_BANK' = PaymentStatus.CANCELED,
  'NOT_RECEIVED' = PaymentStatus.CANCELED,
  'FAILED' = PaymentStatus.CANCELED,
  'CANCELLED_BY_USER' = PaymentStatus.CANCELED,
  'ABANDONED_BY_USER' = PaymentStatus.CANCELED,
}

export type Payment = {
  orderId: string
  paymentId: string
  transactionId: string
  status: PaymentStatus
  remoteId: string
  affiliates: string
}

export type StoredPayment = Payment & {
  id: string
}
