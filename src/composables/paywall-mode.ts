export type Mode = 'subscribe' | 'login'

export interface UsePaywallModeReturn {
  mode: Ref<Mode>
  toggleMode: () => void
  reset: () => void

  primaryButton: Ref<string>
  secondaryButton: Ref<string>
}

export function usePaywallMode(): UsePaywallModeReturn {
  const [state, setState] = useToggle()
  const mode = computed<Mode>(() => (state.value ? 'login' : 'subscribe'))

  const primaryButton = computed(() => (mode.value === 'subscribe' ? 'Subscribe' : 'Sign in'))
  const secondaryButton = computed(() => (mode.value === 'subscribe' ? 'Sign in' : 'Subscribe'))
  return {
    mode,
    toggleMode: () => setState(),
    reset: () => setState(false),

    primaryButton,
    secondaryButton,
  }
}
