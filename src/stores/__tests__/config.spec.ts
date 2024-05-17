import { expect, it } from 'vitest'
import { configSchema } from 'shared/schema'

it('can parse config', () => {
  const fixture = {
    ...DEFAULT_CONFIG,
    freeLimit: {
      interval: 3,
      quota: 1,
    },
  }

  expect(() => configSchema.parse(fixture)).not.toThrow()
  expect(configSchema.parse(fixture)).toEqual(fixture)
})

it('can compatible with old format of freeLimit', () => {
  const fixture = {
    ...DEFAULT_CONFIG,
    freeLimit: 3,
  }

  expect(() => configSchema.parse(fixture)).not.toThrow()
  expect(configSchema.parse(fixture)).toEqual(DEFAULT_CONFIG)
})
