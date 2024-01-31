import { atom } from 'nanostores'
import * as z from 'zod'

export const configSchema = z.object({
  avatar: z.string(),
  publicationLogo: z.string(),
  title: z.string(),
  description: z.string(),
  primaryColor: z.string(),
})

export type Config = z.infer<typeof configSchema>

const DEFAULT_CONFIG: Config = {
  avatar: '',
  publicationLogo: '',
  title: 'Title',
  description: 'Description',
  primaryColor: 'rgb(29 78 216)',
}

export const $config = atom(DEFAULT_CONFIG)

export function setConfig(config: Partial<Config>) {
  $config.set({ ...$config.get(), ...config })
}

declare global {
  interface Window {
    SP_PAYWALL: Config
  }
}

export function initConfig() {
  try {
    setConfig(configSchema.parse(window.SP_PAYWALL))
  } catch {}
}
