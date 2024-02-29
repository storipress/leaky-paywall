import { html, oneLineTrim } from 'proper-tags'
import type { Config } from '~/stores/config'

const PRODUCTION_URL = 'https://assets.stori.press/storipress/leaky-paywall.min.js'
const TEST_URL = 'https://leaky-paywall.pages.dev/leaky-paywall.min.js'
const javascript = oneLineTrim

export function useCreateBookmarklet() {
  // const config = useStore($config)

  const serializedConfig = computed(() => JSON.stringify(toRaw($config.get())))

  const productionHTML = computed(() => {
    return html`
      <script>
        window.${CONFIG_VAR_NAME} = ${serializedConfig.value}
      </script>
      <script type="module" src="${PRODUCTION_URL}"></script>
    `
  })

  const productionTestScript = computed(() => createTestScript(serializedConfig.value, PRODUCTION_URL))

  const devScript = computed(() => createTestScript(serializedConfig.value, TEST_URL))

  return {
    productionHTML,
    productionTestScript,
    devScript,
  }
}

function createTestScript(configString: string, source: string) {
  return javascript`
    var c=document.createElement('script'),s=document.createElement('script');
    c.innerHTML='window.${CONFIG_VAR_NAME}=${configString}';
    s.type='module';
    s.src='${source}';
    document.head.append(c);
    document.head.append(s);`
}
