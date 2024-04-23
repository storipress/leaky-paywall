import * as z from 'zod'

export const userSignIn = defineTrackEvent({
  event: 'subscriber.signed_in',
  properties: {
    pathname: z.string(),
    client_id: z.string(),
    article_id: z.string().nullable(),
  },
})
