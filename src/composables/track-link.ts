import { useEventListener } from '@vueuse/core'
import type { MaybeRefOrGetter } from 'vue'
import { sendTrack } from '~/lib/tracking'
import type { TrackEvent } from '~/lib/tracking-schema'

export function useTrackLink(
  root: MaybeRefOrGetter<Element | undefined>,
  toEvent: (href: string) => TrackEvent | undefined,
) {
  // https://www.ravelrumba.com/blog/tracking-links-with-javascript/
  useEventListener(root, 'click', async (event) => {
    const target = event.target as HTMLAnchorElement
    if (!target || target.tagName !== 'A') {
      return
    }

    const href = target.getAttribute('href')
    if (href) {
      const trackEvent = toEvent(href)
      if (!trackEvent) {
        return
      }
      event.preventDefault()

      sendTrack(trackEvent.event, trackEvent.properties)
      window.open(href, '_blank')
    }
  })
}
