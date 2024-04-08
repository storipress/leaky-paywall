import { defineCustomElement } from 'vue'
import PaywallDebug from './PaywallDebug.ce.vue'

export const PaywallDebugElement = defineCustomElement(PaywallDebug)

customElements.define('storipress-paywall-debug', PaywallDebugElement)

const el = document.createElement('storipress-paywall-debug')
document.body.append(el)
