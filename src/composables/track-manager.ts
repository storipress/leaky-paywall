import { TrackSubscriberActivity } from 'storipress-client'
import Mutex from 'p-mutex'

const mutex = new Mutex()

export function useTrackManager() {
  const paywall = useStore($paywall)
  const paywallEvents = useStore($paywallEvents)

  const { executeMutation: recordTrack } = useMutation(TrackSubscriberActivity)

  async function _flushAll() {
    if (!paywall.value.aid) {
      return
    }

    const records = paywallEvents.value.records
    const lastSynced = paywallEvents.value.lastSynced
    $paywallEvents.setKey('lastSynced', Date.now())
    $paywallEvents.setKey('records', [])
    const config = $config.get()

    for (const record of records) {
      if (record.t < lastSynced) {
        continue
      }

      // TODO: parallel + retry
      await recordTrack({
        input: {
          name: record.e,
          target_id: record.p.article_id ?? config.clientId,
          data: JSON.stringify({ ...record.p, timestamp: record.t }),
          anonymous_id: paywall.value.aid,
        },
      })
    }
  }

  async function flushAll() {
    return await mutex.withLock(() => _flushAll())
  }

  watch(
    () => paywallEvents.value.records,
    () => {
      if (paywallEvents.value.records.length === 0) {
        return
      }
      flushAll()
    },
    { immediate: true, deep: true },
  )

  whenever(
    () => paywall.value.aid,
    () => {
      flushAll()
    },
    { immediate: true },
  )

  onMounted(() => {
    if ($paywall.get().aid) {
      return
    }
    $paywall.setKey('aid', crypto.randomUUID())
  })
}
