import { persistentMap } from '@nanostores/persistent'
import { destr } from 'destr'
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

export const $paywall = persistentMap(
  'storipress-paywall:',
  {
    lastSynced: 0,
    records: [] as BufferedEvent[],
    token: '',
  },
  {
    encode: JSON.stringify,
    decode: destr,
  },
)

export function pushEvent(record: TrackEvent) {
  $paywall.set({
    ...$paywall.get(),
    records: [...$paywall.get().records, { e: record.event, p: record.properties ?? {}, t: Date.now() }],
  })
}
