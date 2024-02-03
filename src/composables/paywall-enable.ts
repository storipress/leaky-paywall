export function usePaywallEnabled() {
  const configStore = useStore($config)
  const location = useBrowserLocation()

  return computed(() => {
    const config = configStore.value
    if (!config.flags.paywall) {
      return false
    }
    if (config.all) {
      return true
    }

    if (config.pathPattern) {
      return config.pathPattern.test(location.value.pathname ?? '')
    }

    return false
  })
}
