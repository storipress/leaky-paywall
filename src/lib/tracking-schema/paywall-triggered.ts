import { z } from 'zod'

export const paywallTriggered = defineTrackEvent({
  event: 'paywall_triggered',
  properties: {
    isExceedFreeLimit: z.boolean(),
    clientId: z.string(),
    articleId: z.string().nullable(),
  },
})
