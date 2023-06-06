import PaymentsMasterdataClient from '../../../../clients/vtex/payments-masterdata'
import { Payment, PaymentStatus, StoredPayment } from './types'

export default class PaymentsRepository {
  constructor(
    private readonly paymentsMasterdataClient: PaymentsMasterdataClient
  ) {}

  public async savePayment(payment: Payment) {
    return this.paymentsMasterdataClient.savePayment(payment)
  }

  public async getPaymentById(paymentId: string) {
    const [payment] = await this.paymentsMasterdataClient.searchPaymentById(
      paymentId
    )

    return payment
  }

  public async getPaymentByOrderId(orderId: string) {
    const [
      payment,
    ] = await this.paymentsMasterdataClient.searchPaymentByOrderId(orderId)

    return payment
  }

  public async getPaymentByRemoteId(remoteId: string) {
    const [
      payment,
    ] = await this.paymentsMasterdataClient.searchPaymentByRemoteId(remoteId)

    return payment
  }

  public async updatePaymentStatus(
    payment: StoredPayment,
    status: PaymentStatus
  ) {
    const updatedPayment: Payment = {
      ...payment,
      status,
    }

    return this.paymentsMasterdataClient.updatePayment(
      payment.id,
      updatedPayment
    )
  }
}
