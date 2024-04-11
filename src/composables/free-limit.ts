export function useOverFreeLimit() {
  const config = useStore($config)
  const paywall = useStore($paywall)
  const readWithTimestamp = computedEager(() => {
    return paywall.value.read.map((item) => {
      const [pathname, timestamp = 0] = item.split(':')
      return {
        p: pathname,
        t: new Date(Number(timestamp)),
      }
    })
  })

  const now = new Date()
  const readInInterval = computedEager(() => {
    if (config.value.freeLimit.interval === 'inf') {
      return readWithTimestamp.value
    }
    const interval = config.value.freeLimit.interval

    const t = new Date(now)
    t.setDate(t.getDate() - 7)
    const nowMinusInterval = subDays(now, interval)
    return readWithTimestamp.value.filter((item) => {
      return isAfter(item.t, nowMinusInterval)
    })
  })

  return computedEager(() => readInInterval.value.length >= config.value.freeLimit.quota)
}
