import { pushEvent } from '~/stores/track-events'
import { ExtractProperties, TrackEvent, trackEventSchema } from './tracking-schema'

export function sendTrack<
  EventName extends TrackEvent['event'],
  Properties extends ExtractProperties<EventName> = ExtractProperties<EventName>,
>(event: EventName, properties: Properties) {
  try {
    const trackEvent = trackEventSchema.parse({ event, properties })
    pushEvent(trackEvent)
  } catch {}
}
