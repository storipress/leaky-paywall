// from: https://github.com/storipress/manager-next/blob/6e2edf8a91a49dab3f13ff049b329c20bcc45c94/src/schema/paywall-config.ts
// TODO: move to shared lib
import { z } from 'zod'

const freeLimit = z.object({
  interval: z.number(),
  quota: z.number(),
})

/**
 * schema for `site.paywall_config`
 */
export const paywallConfig = z.object({
  hit_limit_cta: z.string(),
  free_limit: freeLimit,
  dismissible: z.boolean(),
  brand_color: z.string(),
  logo: z.string().optional().default(''),
})

export type PaywallConfig = z.infer<typeof paywallConfig>
