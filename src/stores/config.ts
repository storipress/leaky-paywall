import { defu } from 'defu'
import type { Config } from 'shared/schema'
import { configSchema } from 'shared/schema'

export const DEFAULT_CONFIG: Config = {
  flags: {
    paywall: true,
    tracking: true,
  },
  freeLimit: {
    quota: 3,
    interval: 7,
  },
  paywallTriggerDepth: 0.45,
  pathPattern: null,
  all: false,
  dismissible: false,
  clientId: '',
  logo: '',
  title: 'Title',
  description: 'Description',
  primaryColor: 'rgb(29 78 216)',
}

export const $config = atom(DEFAULT_CONFIG)

export function setConfig(config: Partial<Config>) {
  $config.set(defu(config as Config, $config.get()))
}

declare global {
  interface Window {
    SP_PAYWALL: Config
  }
}

export const CONFIG_VAR_NAME = 'SP_PAYWALL'

export function initConfig() {
  try {
    setConfig(configSchema.parse(window[CONFIG_VAR_NAME]))
  } catch {}
}
