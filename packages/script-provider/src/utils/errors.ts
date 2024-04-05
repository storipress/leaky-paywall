import type { CombinedError } from '@urql/core'
import { Data } from 'effect'

export class NotFoundError extends Data.TaggedError('NotFoundError') {}

export class GraphqlError extends Data.TaggedError('GraphqlError')<{ cause: CombinedError }> {}
