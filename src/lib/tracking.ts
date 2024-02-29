import type { ExtractProperties, TrackEvent } from './tracking-schema'
import { trackEventSchema } from './tracking-schema'
import { pushEvent } from '~/stores/paywall-events'

export function sendTrack<
  EventName extends TrackEvent['event'],
  Properties extends ExtractProperties<EventName> = ExtractProperties<EventName>,
>(event: EventName, properties: Properties) {
  try {
    const trackEvent = trackEventSchema.parse({ event, properties })
    pushEvent(trackEvent)
  } catch {}
}
