import { TrackSubscriberActivity } from 'storipress-client'

export function useTrackManager() {
  const paywall = useStore($paywall)

  const { executeMutation: recordTrack } = useMutation(TrackSubscriberActivity)

  async function flushAll() {
    if (!paywall.value.token) {
      return
    }

    const records = paywall.value.records
    const lastSynced = paywall.value.lastSynced
    $paywall.setKey('lastSynced', Date.now())
    $paywall.setKey('records', [])

    for (const record of records) {
      if (record.t < lastSynced) {
        continue
      }

      // TODO: parallel + retry
      await recordTrack({
        input: {
          name: record.e,
          target_id: record.p.articleId ?? '',
          data: JSON.stringify(record.p),
        },
      })
    }
  }

  watch(
    () => paywall.value.records,
    () => {
      if (paywall.value.records.length === 0) {
        return
      }
      flushAll()
    },
    { immediate: true, deep: true },
  )

  whenever(
    () => paywall.value.token,
    () => {
      flushAll()
    },
  )
}
