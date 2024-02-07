import { z } from 'zod'

export const pageView = defineTrackEvent({
  event: 'page.view',
  properties: {
    pathname: z.string(),
  },
})
