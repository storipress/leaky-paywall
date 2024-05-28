import path from 'node:path'
import url from 'node:url'
import { expect } from '@playwright/test'
import { beforeAll } from 'vitest'
import { unstable_dev } from 'wrangler'
import { it } from './browser-test'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

beforeAll(async () => {
  const server = await unstable_dev(path.resolve(__dirname, '../src/index.ts'), {
    port: 8888,
    experimental: {
      disableExperimentalWarning: true,
    },
  })

  return async () => {
    await server.stop()
  }
})

it('can load prophet script', async ({ page }) => {
  await page.evaluate(() => {
    let resolve_: () => void
    let reject_: (error: string | Event) => void
    const promise = new Promise<void>((resolve, reject) => {
      resolve_ = resolve
      reject_ = reject
    })
    const script = document.createElement('script')
    script.src = 'http://localhost:8888/DX1TO43FK/prophet.js'
    script.crossOrigin = 'anonymous'
    script.onload = () => {
      resolve_()
    }
    script.onerror = (error) => {
      reject_(error)
    }
    document.body.appendChild(script)
    return promise
  })

  expect(true).toBe(true)
})
