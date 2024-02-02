import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue'

const [provideRoot, injectRoot] = createInjectionState<
  [MaybeRefOrGetter<HTMLElement | ComponentPublicInstance | null>],
  Ref<HTMLElement | null>
>((x) => computed(() => unrefElement(x) as HTMLElement | null), {
  injectionKey: 'sp-portal-root',
})

export { provideRoot, injectRoot }
