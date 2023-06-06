import { ServiceContext } from '@vtex/api'
import {
  Recipient,
  SettlementRequest,
  Settlements,
} from '@vtex/payment-provider'

import { Clients } from '../../clients'
import { CustomLogger } from '../../utils/logger'
import { Configuration } from '../shared/configuration.service'

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

  private async transferSplit() {
    const { clients } = this.ctx
    const token = await this.configClient.getToken()

    const array: Recipient[] = [
      {
        id: 'vtexdayhackathon5',
        name: 'VTEX COMMERCE CLOUD SOLUTIONS LLC',
        documentType: 'CNPJ',
        document: '',
        role: 'marketplace',
        chargeProcessingFee: true,
        chargebackLiable: true,
        amount: 156.0,
      },
    ]

    try {
      Promise.all(
        array.map((recipient) => {
          return clients.stripeClient().transfer(
            {
              amount: recipient.amount * 100,
              currency: 'brl',
              transfer_groupd: '',
              destination: '',
            },
            token
          )
        })
      ).then((response) => {
        console.log(response)
      })
    } catch (err) {
      this.logger.error('MAKE_TRANSFER_ERROR', err)
    }
  }

  public execute() {
    console.log('SETTLEMENT')

    this.transferSplit()

    return Settlements.deny(this.settlement)
  }
}
