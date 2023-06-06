import { ServiceContext } from '@vtex/api'

import { BUCKET_NAME, Config, PATH_NAME } from './types'

export class Configuration {
  private ctx: ServiceContext

  constructor(ctx: ServiceContext) {
    this.ctx = ctx
  }

  public async getJSON() {
    const {
      clients: { vbase },
    } = this.ctx

    const config = await vbase.getJSON<Config>(BUCKET_NAME, PATH_NAME, true)

    return config
  }

  public async saveToken(token: string) {
    const {
      clients: { vbase },
    } = this.ctx

    const savedConfig = this.getJSON()

    if (!savedConfig) {
      const config: Config = {
        token,
      }

      await vbase.saveJSON(BUCKET_NAME, PATH_NAME, config)
    } else {
      await vbase.saveJSON(BUCKET_NAME, PATH_NAME, { ...savedConfig, token })
    }
  }

  public async getToken(): Promise<string> {
    const {
      clients: { vbase },
    } = this.ctx

    const { token } = await vbase.getJSON<Config>(BUCKET_NAME, PATH_NAME, true)

    return token
  }

  public async getCaptureDelay() {
    const DAY = 0

    return DAY * 24 * 60 * 60
  }
}
