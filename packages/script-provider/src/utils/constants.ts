import { withQuery } from 'ufo'
import { version } from 'version-proxy'

export const PRODUCTION_URL = withQuery('https://assets.stori.press/storipress/leaky-paywall.min.js', { v: version })
export const PRODUCTION_DEBUG_URL = withQuery('https://assets.stori.press/storipress/leaky-paywall-debug.min.js', {
  v: version,
})
export const CONFIG_VAR_NAME = 'SP_PAYWALL'
