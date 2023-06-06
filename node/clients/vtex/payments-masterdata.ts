import { MasterData } from '@vtex/api'

import {
  Payment,
  StoredPayment,
} from '../../modules/shared/repositories/payments/types'

export default class PaymentsMasterdataClient extends MasterData {
  private readonly DATA_ENTITY = 'supplier_payments'
  private readonly SCHEMA = 'payment'
  private readonly DEFAULT_FIELDS = [
    'id',
    'orderId',
    'paymentId',
    'transactionId',
    'status',
    'remoteId',
    'affiliates',
  ]

  public async savePayment(payment: Payment) {
    return this.createDocument({
      fields: payment,
      dataEntity: this.DATA_ENTITY,
      schema: this.SCHEMA,
    })
  }

  public async searchPaymentById(paymentId: string) {
    return this.searchDocuments<StoredPayment>({
      where: `(paymentId=${paymentId})`,
      fields: this.DEFAULT_FIELDS,
      pagination: {
        page: 1,
        pageSize: 1,
      },
      dataEntity: this.DATA_ENTITY,
      schema: this.SCHEMA,
    })
  }

  public async searchPaymentByOrderId(orderId: string) {
    return this.searchDocuments<StoredPayment>({
      where: `(orderId=${orderId})`,
      fields: this.DEFAULT_FIELDS,
      pagination: {
        page: 1,
        pageSize: 1,
      },
      dataEntity: this.DATA_ENTITY,
      schema: this.SCHEMA,
    })
  }

  public async searchPaymentByRemoteId(remoteId: string) {
    return this.searchDocuments<StoredPayment>({
      where: `(remoteId=${remoteId})`,
      fields: this.DEFAULT_FIELDS,
      pagination: {
        page: 1,
        pageSize: 1,
      },
      dataEntity: this.DATA_ENTITY,
      schema: this.SCHEMA,
    })
  }

  public async updatePayment(documentId: string, payment: Payment) {
    return this.updatePartialDocument({
      id: documentId,
      fields: payment,
      dataEntity: this.DATA_ENTITY,
      schema: this.SCHEMA,
    })
  }
}
