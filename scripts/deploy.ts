import { $ } from 'zx'

$.verbose = true

await $({ stdio: 'inherit' })`moon run shared:build`
await $`vite build`
await $`vite build --mode=lib`
await $`node esbuild.config.js`
await $`cp lib/leaky-paywall.min.js dist`
