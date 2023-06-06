import { ServiceContext } from '@vtex/api'
import {
  Recipient,
  SettlementRequest,
  Settlements,
} from '@vtex/payment-provider'

import { Clients } from '../../clients'
import { CustomLogger } from '../../utils/logger'
import { Configuration } from '../shared/configuration.service'
import { PaymentIntent } from '../../clients/stripe/payment-intent'

export class Settle {
  private ctx: ServiceContext<Clients>
  private settlement: SettlementRequest
  private logger: CustomLogger
  private configClient: Configuration

  constructor(ctx: ServiceContext<Clients>, settlement: SettlementRequest) {
    this.ctx = ctx
    this.settlement = settlement
    this.logger = new CustomLogger(this.ctx.vtex.logger)
    this.configClient = new Configuration(ctx)
  }

  private async getPaymentIntent() {
    const { clients } = this.ctx

    const paymentIntentId = this.settlement.tid as string

    try {
      const token = await this.configClient.getToken()

      const pamentIntent = await clients
        .stripeClient()
        .getPaymentIntent(paymentIntentId, token)

      return pamentIntent
    } catch (err) {
      console.log('ERROR', err)

      return null
    }
  }

  private async transferSplit(paymentIntent: PaymentIntent) {
    const { clients } = this.ctx
    const token = await this.configClient.getToken()

    this.logger.info('TRANSFER_RECIPIENT', this.settlement.recipients)

    const recipientArray: Recipient[] = this.settlement.recipients?.filter(
      (recipient) => recipient.role !== 'marketplace'
    ) as Recipient[]

    this.logger.info('TRANSFER_RECIPIENT', recipientArray)

    try {
      Promise.all(
        recipientArray.map((recipient) => {
          return clients.stripeClient().transfer(
            {
              amount: Math.floor(recipient.amount * 100),
              currency: paymentIntent.currency,
              transfer_group: paymentIntent.transfer_group,
              destination: recipient.document,
              source_transaction: paymentIntent.charges.data[0].id,
            },
            token
          )
        })
      )
        .catch((err) => {
          this.logger.error('PROMISE_MAKE_TRANSFER_ERROR', err)
        })
        .then((response) => {
          console.log(response)

          return true
        })
    } catch (err) {
      this.logger.error('MAKE_TRANSFER_ERROR', err)

      return false
    }

    return false
  }

  private async checkPayment(paymentIntent: PaymentIntent) {
    try {
      switch (paymentIntent.status) {
        case 'succeeded': {
          const transferResult = await this.transferSplit(paymentIntent)

          if (transferResult) {
            return Settlements.approve(this.settlement, {
              settleId: paymentIntent.id,
            })
          }

          return Settlements.deny(this.settlement)
        }

        default:
          return Settlements.deny(this.settlement)
      }
    } catch (err) {
      this.logger.error('SETTLEMENT_CHECKPAYMENT_ERROR', err)

      return Settlements.deny(this.settlement)
    }
  }

  public async execute() {
    try {
      const paymentIntent = await this.getPaymentIntent()

      if (!paymentIntent) {
        return Settlements.deny(this.settlement)
      }

      const conclusion = await this.checkPayment(paymentIntent)

      return conclusion
    } catch (err) {
      this.logger.error('SETTLEMENT_ERROR', err)
    }

    return Settlements.deny(this.settlement)
  }
}
