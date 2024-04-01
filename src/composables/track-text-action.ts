import { debounce } from 'remeda'
import { sendTrack } from '~/lib/tracking'
import type { TrackEvent } from '~/lib/tracking-schema'

export function useTrackTextAction(articleEl: ComputedRef<HTMLElement | undefined>) {
  const state = useTextSelection()
  const selectedText = computed(() => state.text.value)

  function trackTextSelection(eventFactory: (selectedText: string) => TrackEvent | undefined) {
    useEventListener(articleEl, 'mouseup', () => {
      trackTextEvent(eventFactory)
    })
  }

  function trackTextCopy(eventFactory: (copiedText: string) => TrackEvent | undefined) {
    const trigger = debounce(
      () => {
        trackTextEvent(eventFactory)
      },
      { waitMs: 200 },
    )

    useEventListener(articleEl, 'copy', () => {
      trigger.call()
    })
  }

  function trackTextEvent(eventFactory: (text: string) => TrackEvent | undefined) {
    if (selectedText.value) {
      const trackEvent = eventFactory(selectedText.value)
      if (!trackEvent) return
      sendTrack(trackEvent.event, trackEvent.properties)
    }
  }

  return { trackTextCopy, trackTextSelection }
}
