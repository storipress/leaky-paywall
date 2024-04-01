import { debounce } from 'remeda'
import { sendTrack } from '~/lib/tracking'
import type { TrackEvent } from '~/lib/tracking-schema'

export function useTrackTextAction(articleEl: ComputedRef<HTMLElement | undefined>) {
  const state = useTextSelection()
  const selectedText = computed(() => state.text.value)

  function trackTextSelection(trackEvent: (selectedText: string) => TrackEvent | undefined) {
    useEventListener(articleEl, 'mouseup', () => {
      trackTextEvent(trackEvent)
    })
  }

  function trackTextCopy(trackEvent: (copiedText: string) => TrackEvent | undefined) {
    const trigger = debounce(
      () => {
        trackTextEvent(trackEvent)
      },
      { waitMs: 200 },
    )

    useEventListener(articleEl, 'copy', () => {
      trigger.call()
    })
  }

  function trackTextEvent(eventHandler: (text: string) => TrackEvent | undefined) {
    if (selectedText.value) {
      const trackEvent = eventHandler(selectedText.value)
      if (!trackEvent) return
      sendTrack(trackEvent.event, trackEvent.properties)
    }
  }

  return { trackTextCopy, trackTextSelection }
}
