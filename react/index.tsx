import React, { useCallback, useEffect } from 'react'

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
  const VOLT_CONTAINER_ID = 'volt-payment-component'
  const parsedPayload = appPayload && JSON.parse(appPayload)

  // TODO: inject Volt SDK into the page
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

  const initializeVoltPaymentEmbedded = useCallback(() => {}, [parsedPayload])

  useEffect(() => {
    console.log('RUNNING')

    window.$(window).trigger('removePaymentLoading.vtex')

    injectScript({
      id: 'volt-sdk',
      src: 'https://js.volt.io/v1',
      onLoad: initializeVoltPaymentEmbedded,
    })
  }, [initializeVoltPaymentEmbedded])

  return (
    <div className={styles.wrapper}>
      <div id={VOLT_CONTAINER_ID}>
        {/* Volt Drop-in component will be rendered here */}
      </div>
    </div>
  )
}

export default EmbeddedAuthorizationApp
