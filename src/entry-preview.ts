import { defineCustomElement } from 'vue'
import PaywallPreview from './PaywallPreview.ce.vue'

export const PaywallPreviewElement = defineCustomElement(PaywallPreview)

customElements.define('storipress-paywall-preview', PaywallPreviewElement)
