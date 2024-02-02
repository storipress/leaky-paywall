import { useStore } from '@nanostores/vue'
import { oneLineTrim } from 'proper-tags'
import { $config } from '~/stores/config'

const javascript = oneLineTrim

export function useCreateBookmarklet() {
  const config = useStore($config)

  const injectScript = computed(
    () => javascript`
    var c=document.createElement('script'),s=document.createElement('script');
    c.innerHTML='window.SP_PAYWALL=${JSON.stringify(config.value)}';
    s.type='module';
    s.src='https://leaky-paywall.pages.dev/leaky-paywall.min.js';
    document.head.append(c);
    document.head.append(s);`,
  )

  const bookmarklet = computed(() => {
    return `javascript:${injectScript.value}`
  })

  return {
    bookmarklet,
  }
}
