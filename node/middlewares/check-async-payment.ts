import { json } from 'co-body'
import { ServiceContext } from '@vtex/api'

import { PaymentIntent } from '../clients/stripe/payment-intent'
import { Clients } from '../clients'
import PaymentsRepository from '../modules/shared/repositories/payments'
import { Configuration } from '../modules/shared/configuration.service'

export async function checkPayment(
  ctx: ServiceContext<Clients>,
  next: () => Promise<any>
) {
  const {
    clients,
    vtex: { account },
  } = ctx

  const body: { paymentIntent: PaymentIntent } = await json(ctx.req)

  const { paymentIntent } = body

  console.log('ASYNC PAYMENT', paymentIntent)

  try {
    const repository = new PaymentsRepository(
      ctx.clients.paymentsMasterdataClient()
    )

    const configClient = new Configuration(ctx)

    const paymentData = await repository.getPaymentByRemoteId(paymentIntent.id)

    const delayToAutoSettle = await configClient.getCaptureDelay()

    console.log(paymentData)

    switch (paymentIntent.status) {
      case 'succeeded':
        {
          const response = await clients.vtexCallBackClient().execute(
            {
              paymentId: paymentData.paymentId,
              transactionId: paymentData.transactionId,
              account,
            },
            {
              paymentId: paymentData.paymentId as string,
              tid: paymentIntent.id,
              authorizationId: '',
              nsu: '',
              status: 'approved',
              code: 'approved',
              message: 'Payment approved by acquirer',
              delayToAutoSettle,
            }
          )

          console.log(response)
        }

        break

      case 'canceled':
        {
          const response = await clients.vtexCallBackClient().execute(
            {
              paymentId: paymentData.paymentId,
              transactionId: paymentData.transactionId,
              account,
            },
            {
              paymentId: paymentData.paymentId as string,
              tid: paymentIntent.id,
              authorizationId: '',
              nsu: '',
              status: 'denied',
              code: 'approved',
              message: 'Payment approved by acquirer',
              delayToAutoSettle,
            }
          )

          console.log(response)
        }

        break

      default: {
        const response = await clients.vtexCallBackClient().execute(
          {
            paymentId: paymentData.paymentId,
            transactionId: paymentData.transactionId,
            account,
          },
          {
            paymentId: paymentData.paymentId as string,
            tid: paymentIntent.id,
            authorizationId: '',
            nsu: '',
            status: 'undefined',
            code: 'approved',
            message: 'Payment approved by acquirer',
            delayToAutoSettle,
          }
        )

        console.log(response)
      }
    }
  } catch (err) {
    console.log(err)
  }

  next()
}
