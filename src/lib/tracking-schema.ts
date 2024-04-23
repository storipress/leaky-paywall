import * as z from 'zod'
import { paywallCanceled } from './tracking-schema/paywall-canceled'
import { articleViewed } from './tracking-schema/article-viewed'
import { pageViewed } from './tracking-schema/page-viewed'
import { paywallReached } from './tracking-schema/paywall-reached'
import { subscriberSignedIn } from './tracking-schema/subscriber-signed-in'
import { articleHyperlinkClicked } from './tracking-schema/article-hyperlink-clicked'
import { paywallActivated } from './tracking-schema/paywall-activated'
import { articleRead } from './tracking-schema/article-read'
import { articleTextSelected } from './tracking-schema/article-text-selected'
import { articleTextCopied } from './tracking-schema/article-text-copied'

// We must import 1 by 1 or we will lost the type info here
export const trackEventSchema = z.discriminatedUnion('event', [
  paywallCanceled,
  articleViewed,
  pageViewed,
  paywallActivated,
  paywallReached,
  subscriberSignedIn,
  articleHyperlinkClicked,
  articleRead,
  articleTextSelected,
  articleTextCopied,
])

export type TrackEvent = z.infer<typeof trackEventSchema>

export type ExtractProperties<EventName extends TrackEvent['event']> = Extract<
  TrackEvent,
  { event: EventName }
>['properties']
