import { z } from 'zod'

export const pageView = defineTrackEvent({
  event: 'page.viewed',
  properties: {
    pathname: z.string(),
  },
})
