export function useScrollHeight() {
  const height = ref(0)

  const updateScrollHeight = () => {
    height.value = document.documentElement.scrollHeight
  }

  useEventListener('resize', updateScrollHeight, { passive: true, capture: true })
  useEventListener('scroll', updateScrollHeight, { passive: true, capture: true })

  return { height }
}
