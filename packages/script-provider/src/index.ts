import { Hono } from 'hono'
import { oneLineTrim } from 'proper-tags'
import esbuild from 'esbuild-wasm'
import wasm from '../../../node_modules/esbuild-wasm/esbuild.wasm'

const PRODUCTION_URL = 'https://assets.stori.press/storipress/leaky-paywall.min.js'
const CONFIG_VAR_NAME = 'SP_PAYWALL'

// @ts-expect-error polyfill
globalThis.performance = Date

const javascript = oneLineTrim

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

let initialized = false

app.get('/:clientId/prophet.js', async (c) => {
  if (!initialized) {
    await esbuild.initialize({
      wasmModule: wasm,
      worker: false,
    })
    initialized = true
  }
  const config = JSON.stringify({
    flags: {
      paywall: true,
      tracking: true,
    },
    freeLimit: 3,
    pathPattern: null,
    all: false,
    clientId: c.req.param('clientId'),
    logo: '',
    // TODO: find a way to read these config
    title: 'Title',
    description: 'Description',
    primaryColor: 'rgb(29 78 216)',
  })
  const code = javascript`
        window.${CONFIG_VAR_NAME} = ${config};
    let s=document.createElement('script');
    s.type='module';
    s.src='${PRODUCTION_URL}';
    document.head.append(s);
  `

  const minified = await esbuild.transform(code, { loader: 'js', minify: true })
  return c.text(minified.code, 200, { 'content-type': 'text/javascript' })
})

export default app
