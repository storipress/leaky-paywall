import { expect } from 'vitest'
import { Array, Effect } from 'effect'
import { fs, glob } from 'zx'
import { it } from '@effect/vitest'
import { trackEventSchema } from '../src/lib/tracking-schema'

const eventNames = Array.fromIterable(trackEventSchema.optionsMap.keys()) as string[]

it.effect('use all tracking event', () => {
  return Effect.gen(function* () {
    const files = yield* Effect.promise(() => glob(['src/**/*', '!**/__tests__/**/*', '!src/lib/tracking-schema/**/*']))
    const contents = yield* Effect.all(
      files.map((file) => Effect.promise(() => fs.readFile(file, 'utf8'))),
      { concurrency: 'unbounded' },
    )

    expect(Array.every(eventNames, (name) => Array.some(contents, (content) => content.includes(name)))).toBe(true)
  })
})
