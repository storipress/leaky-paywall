import { map } from 'nanostores'
import type { TrackEvent } from '../lib/tracking-schema'

export interface BufferedEvent {
  /**
   * Event name
   */
  e: string

  /**
   * Properties
   */
  p: Record<string, any>

  /**
   * Timestamp
   */
  t: number
}

export interface PaywallEvents {
  lastSynced: number
  records: BufferedEvent[]
}

export const $paywallEvents = map<PaywallEvents>({
  lastSynced: 0,
  records: [] as BufferedEvent[],
})

export function pushEvent(record: TrackEvent) {
  const paywall = $paywallEvents.get()
  $paywallEvents.set({
    ...paywall,
    records: [...paywall.records, { e: record.event, p: record.properties ?? {}, t: Date.now() }],
  })
}
