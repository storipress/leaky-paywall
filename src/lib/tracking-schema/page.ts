import { z } from 'zod'

export const page = defineTrackEvent({
  event: 'page',
  properties: {
    pathname: z.string(),
  },
})
