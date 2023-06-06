import React, { useEffect, useState } from 'react'

import styles from './index.css'

const StripePaymentAuth = (props) => {
  const [isLoading, setLoading] = useState(false)

  const respondTransaction = (status) => {
    window.$(window).trigger('transactionValidation.vtex', [status])
  }

  function handleOnError(e) {
    console.log('error', e)
  }

  async function handleOnChange(state, component) {
    console.log('START_HANDLEONCHANGE')
  }

  async function handlePaymentCompleted(result, component) {
    console.info(result, component)
  }

  async function handleOnAdditionalDetails(state, component) {
    console.log('START_HANDLEONADDITIONALDETAILS')
  }

  const createPayment = async () => {
    console.log('START_PAYMENT')

    const { token, client_secret } = parsedPayload

    console.log(token, client_secret)
  }

  useEffect(() => {
    console.log('StartApp')

    // createPayment()
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div id="stripe-container">Teste</div>
        {isLoading ? <div className={styles.loader}></div> : ''}
      </div>
    </div>
  )
}

export default StripePaymentAuth
