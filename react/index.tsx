import React, { useCallback, useEffect } from 'react'
import axios from 'axios'

import styles from './index.css'

type Props = {
  appPayload: string
}

type InjectScriptProps = {
  id: string
  src: string
  onLoad: (this: GlobalEventHandlers, ev: Event) => void
}

const EmbeddedAuthorizationApp = ({ appPayload }: Props) => {
  const STRIPE_CONTAINER_ID = 'stripe-payment-component'
  const parsedPayload = appPayload && JSON.parse(appPayload)

  // TODO: inject Stripe SDK into the page
  const injectScript = ({ id, src, onLoad }: InjectScriptProps) => {
    if (document.getElementById(id)) {
      return
    }

    // eslint-disable-next-line prefer-destructuring
    const head = document.getElementsByTagName('head')[0]
    const js = document.createElement('script')

    js.id = id
    js.src = src
    js.async = true
    js.defer = true
    js.onload = onLoad

    head.appendChild(js)
  }

  const initializeStripePaymentEmbedded = useCallback(() => {
    const stripe = new window.Stripe(parsedPayload.token)

    stripe
      .handleNextAction({
        clientSecret: parsedPayload.client_secret,
      })
      .then(async function(result: any) {
        const response = await axios.post(
          '/_v/api/payment/async-payment-conclusion',
          {
            ...result,
            paymentId: parsedPayload.paymentId,
            transactionId: parsedPayload.transactionId,
          }
        )
      })

    window.$(window).trigger('removePaymentLoading.vtex')
  }, [parsedPayload])

  useEffect(() => {
    injectScript({
      id: 'stripe-sdk',
      src: 'https://js.stripe.com/v3/',
      onLoad: initializeStripePaymentEmbedded,
    })
  }, [initializeStripePaymentEmbedded])

  return (
    <div className={styles.wrapper}>
      <div id={STRIPE_CONTAINER_ID}>
        {/* Stripe Drop-in component will be rendered here */}
      </div>
    </div>
  )
}

export default EmbeddedAuthorizationApp
