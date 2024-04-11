import * as z from 'zod'
import { defu } from 'defu'

const flagsSchema = z.object({
  paywall: z.boolean().optional().default(true),
  tracking: z.boolean().optional().default(true),
})

export const freeLimitSchema = z.object({
  quota: z.coerce.number().optional().default(3),
  interval: z
    .union([z.literal('inf'), z.coerce.number()])
    .optional()
    .default(7),
})

export type FreeLimit = z.infer<typeof freeLimitSchema>

export const configSchema = z.object({
  flags: flagsSchema.optional().default({
    paywall: true,
    tracking: true,
  }),
  freeLimit: z.union([
    freeLimitSchema,
    z.coerce
      .number()
      .optional()
      .default(3)
      .transform((quota) => ({
        quota,
        interval: 7,
      }))
      .pipe(freeLimitSchema),
  ]),
  clientId: z.string(),
  dismissible: z.boolean().optional().default(false),
  all: z.boolean().optional().default(false),
  pathPattern: z.instanceof(RegExp).nullish(),
  logo: z.string(),
  title: z.string(),
  description: z.string(),
  primaryColor: z.string(),
})

export type Config = z.infer<typeof configSchema>

export const DEFAULT_CONFIG: Config = {
  flags: {
    paywall: true,
    tracking: true,
  },
  freeLimit: {
    quota: 3,
    interval: 7,
  },
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
