import { Data } from 'effect'

export class NotFoundError extends Data.TaggedError('NotFoundError') {}
