import { $ } from 'zx'

await $`vite build`
await $`vite build --mode=lib`
await $`node esbuild.config.js`
await $`cp lib/leaky-paywall.min.js dist`
