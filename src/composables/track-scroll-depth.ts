import type { Ref } from 'vue'

export function useTrackScrollDepth(articleEl: Readonly<Ref<HTMLElement | undefined>>, threshold = 10) {
  const maxPercentage = ref(0)
  const percentage = ref<number>()

  const { y } = useWindowScroll()
  const { height } = useWindowSize()

  const lastPercentage = computed(() => {
    const el = articleEl.value
    if (!el) return null

    return Math.min(100, Math.round(((y.value + height.value - el.offsetTop) / el.offsetHeight) * 100))
  })

  const targetIsVisible = useElementVisibility(articleEl)

  whenever(lastPercentage, (lastPercentage) => {
    if (!targetIsVisible.value) return

    // percentage thresholds, this will be a numeric value (0-100) indicating the scroll depth that caused the trigger to fire
    const result = lastPercentage / threshold
    if (result >= 1 && Math.floor(result) > maxPercentage.value) {
      maxPercentage.value = result
      percentage.value = lastPercentage
    }
  })

  return {
    lastPercentage,
    percentage,
  }
}
