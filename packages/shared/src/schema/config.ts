import { z } from 'zod'

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

const viewportPaywallTrigger = z.object({
  type: z.literal('viewport'),
  value: z.number(),
})

const articlePaywallTrigger = z.object({
  type: z.literal('article'),
  value: z.number(),
})

const paywallTriggerSchema = z.discriminatedUnion('type', [viewportPaywallTrigger, articlePaywallTrigger])

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
  paywallTrigger: paywallTriggerSchema.optional().default(() => ({
    type: 'article' as const,
    value: 0.45,
  })),
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
