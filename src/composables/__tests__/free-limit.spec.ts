import { beforeEach, expect, it, vi } from 'vitest'
import { useOverFreeLimit } from '../free-limit'

beforeEach(() => {
  vi.useFakeTimers()
  $paywall.setKey('read', [])
  const currentConfig = structuredClone($config.get())

  return () => {
    vi.useRealTimers()
    $paywall.setKey('read', [])
    $config.set(currentConfig)
  }
})

const A_WEEK = 7 * 24 * 60 * 60 * 1000

it('can check for reading in interval', () => {
  vi.setSystemTime(A_WEEK * 2)

  $config.set({
    ...$config.get(),
    freeLimit: {
      quota: 3,
      interval: 7,
    },
  })

  const isOverFreeLimit = useOverFreeLimit()

  $paywall.setKey('read', [`/after:${A_WEEK + 1000}`, `/after:${A_WEEK + 1000}`, `/after:${A_WEEK + 1000}`])

  expect(isOverFreeLimit.value).toBe(true)

  $paywall.setKey('read', [`/after:${A_WEEK + 1000}`, `/after:${A_WEEK + 1000}`])

  expect(isOverFreeLimit.value).toBe(false)

  $paywall.setKey('read', [
    `/before:${A_WEEK - 1000}`,
    `/before:${A_WEEK - 1000}`,
    `/after:${A_WEEK + 1000}`,
    `/after:${A_WEEK + 1000}`,
  ])

  expect(isOverFreeLimit.value).toBe(false)
})
