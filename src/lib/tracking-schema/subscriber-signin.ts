import * as z from 'zod'

export const subscriberSignIn = defineTrackEvent({
  event: 'subscriber_sign_in',
  properties: {
    pathname: z.string(),
    clientId: z.string(),
    articleId: z.string().nullable(),
  },
})
