import { defineCustomElement } from 'vue'
import PaywallRoot from './PaywallRoot.ce.vue'

export const PaywallRootElement = defineCustomElement(PaywallRoot)

customElements.define('storipress-paywall', PaywallRootElement)
