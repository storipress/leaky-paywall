import * as z from 'zod'
import { articleScrollBack } from './tracking-schema/article-scroll-back'
import { articleView } from './tracking-schema/article-view'
import { page } from './tracking-schema/page'
import { paywallTriggered } from './tracking-schema/paywall-triggered'
import { subscriberSignIn } from './tracking-schema/subscriber-signin'
import { articleLinkClicked } from './tracking-schema/article-link-clicked'

// We must import 1 by 1 or we will lost the type info here
export const trackEventSchema = z.discriminatedUnion('event', [
  articleScrollBack,
  articleView,
  page,
  paywallTriggered,
  subscriberSignIn,
  articleLinkClicked,
])

export type TrackEvent = z.infer<typeof trackEventSchema>

export type ExtractProperties<EventName extends TrackEvent['event']> = Extract<
  TrackEvent,
  { event: EventName }
>['properties']
