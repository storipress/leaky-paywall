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
    read: [] as string[],
    token: '',
  },
  {
    encode: JSON.stringify,
    decode: destr,
  },
)

export function pushEvent(record: TrackEvent) {
  const paywall = $paywall.get()
  $paywall.set({
    ...paywall,
    records: [...paywall.records, { e: record.event, p: record.properties ?? {}, t: Date.now() }],
  })
}

export function pushRead(read: string) {
  const paywall = $paywall.get()

  $paywall.set({
    ...paywall,
    read: [...new Set([...paywall.read, read])],
  })
}
