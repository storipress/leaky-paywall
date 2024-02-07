import * as z from 'zod'
import { articleScrollBack } from './tracking-schema/article-scroll-back'
import { articleView } from './tracking-schema/article-view'
import { pageView } from './tracking-schema/page-view'
import { paywallReached } from './tracking-schema/paywall-reached'
import { userSignIn } from './tracking-schema/subscriber-signin'
import { articleLinkClicked } from './tracking-schema/article-link-clicked'
import { paywallDisplay } from './tracking-schema/paywall-display'

// We must import 1 by 1 or we will lost the type info here
export const trackEventSchema = z.discriminatedUnion('event', [
  articleScrollBack,
  articleView,
  pageView,
  paywallDisplay,
  paywallReached,
  userSignIn,
  articleLinkClicked,
])

export type TrackEvent = z.infer<typeof trackEventSchema>

export type ExtractProperties<EventName extends TrackEvent['event']> = Extract<
  TrackEvent,
  { event: EventName }
>['properties']
