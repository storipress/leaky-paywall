import * as z from 'zod'
import { defu } from 'defu'

const flagsSchema = z.object({
  paywall: z.boolean().optional().default(true),
  tracking: z.boolean().optional().default(true),
})

export const configSchema = z.object({
  flags: flagsSchema.optional().default({
    paywall: true,
    tracking: true,
  }),
  freeLimit: z.number().optional().default(3),
  clientId: z.string(),
  all: z.boolean().optional().default(false),
  pathPattern: z.instanceof(RegExp).nullish(),
  avatar: z.string(),
  publicationLogo: z.string(),
  title: z.string(),
  description: z.string(),
  primaryColor: z.string(),
})

export type Config = z.infer<typeof configSchema>

const DEFAULT_CONFIG: Config = {
  flags: {
    paywall: true,
    tracking: true,
  },
  freeLimit: 3,
  pathPattern: null,
  all: false,
  clientId: '',
  avatar: '',
  publicationLogo: '',
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
