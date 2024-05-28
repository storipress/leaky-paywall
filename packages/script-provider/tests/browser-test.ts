import { test } from 'vitest'
import type { Browser, BrowserContext, Page } from '@playwright/test'
import { chromium } from '@playwright/test'

interface WithBrowser {
  browser: Browser
}

const withBrowser = test.extend<WithBrowser>({
  // eslint-disable-next-line no-empty-pattern
  browser: async ({}, use) => {
    const browser = await chromium.launch()
    await use(browser)
    browser.close()
  },
})

interface WithBrowserContext {
  context: BrowserContext
}

const withBrowserContext = withBrowser.extend<WithBrowserContext>({
  context: async ({ browser }, use) => {
    const context = await browser.newContext()
    await use(context)
  },
})

interface WithPage {
  page: Page
}

const withPage = withBrowserContext.extend<WithPage>({
  page: async ({ context }, use) => {
    const page = await context.newPage()
    await use(page)
  },
})

export { withPage as it }
