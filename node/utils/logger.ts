import { Logger } from '@vtex/api'

export class CustomLogger {
  private logger?: any

  constructor(vtexLogger: Logger) {
    if (typeof vtexLogger === 'undefined') {
      this.logger = null
    } else {
      this.logger = vtexLogger
    }
  }

  public info(refText: string, data: any) {
    const report = `\x1b[36m${refText}: \x1b[37m${JSON.stringify(
      data,
      null,
      1
    )}`

    console.info(report)

    if (!this?.logger) {
      return
    }

    this.logger.info(report)
  }

  public error(title: string, err: any) {
    let message = 'Unable to capture the message error'

    if (err.response) {
      const { url, params, baseURL, timeout } = err.response.config
      const { data } = err.response
      const { statusText, status } = err.response

      message = JSON.stringify({
        endpoint: `${baseURL}${url}`,
        url,
        // headers,
        params,
        baseURL,
        timeout,
        data,
        statusText,
        status,
      })
    } else if (err.request) {
      message = JSON.stringify(err.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.info({ reportError: err })
      message = `${JSON.stringify(err)} ${err.toString()}`
    }

    console.info(`\x1b[31m${title}`, message)

    if (!this?.logger) {
      return message
    }

    this.logger.info(`${title} ${message}`)

    return JSON.stringify(message)
  }
}
