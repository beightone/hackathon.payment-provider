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

  const body: { paymentIntent: PaymentIntent; error: any } = await json(ctx.req)

  const { paymentIntent, error } = body

  ctx.status = 200

  console.log('ASYNC PAYMENT', body, paymentIntent)

  try {
    const repository = new PaymentsRepository(
      ctx.clients.paymentsMasterdataClient()
    )

    const configClient = new Configuration(ctx)

    const delayToAutoSettle = await configClient.getCaptureDelay()

    if (error) {
      ctx.body = false

      console.log(error.payment_intent)

      const paymentData = await repository.getPaymentByRemoteId(
        error.payment_intent.id
      )

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
    } else {
      const paymentData = await repository.getPaymentByRemoteId(
        paymentIntent.id
      )

      switch (paymentIntent.status) {
        case 'succeeded':
          {
            ctx.body = true

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
            ctx.body = false

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
    }
  } catch (err) {
    console.log(err)
  }

  next()
}
