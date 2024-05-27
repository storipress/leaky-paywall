import { persistentMap } from '@nanostores/persistent'
import { destr } from 'destr'

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

export interface PaywallState {
  read: string[]
  token: string
  aid: string
}

export const $paywall = persistentMap<PaywallState>(
  'storipress-paywall:',
  {
    read: [] as string[],
    token: '',
    aid: '',
  },
  {
    encode: JSON.stringify,
    decode: destr,
  },
)

export function pushRead(read: string) {
  const paywall = $paywall.get()

  $paywall.set({
    ...paywall,
    read: [...new Set([...paywall.read, read])],
  })
}
