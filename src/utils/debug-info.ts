import { Duration, Effect, Option, Schedule, pipe } from 'effect'
import type { FoundedArticle } from '~/composables/find-article'
import type { Config } from '~/stores/config'
import type { PaywallState } from '~/stores/paywall-events'

interface DebugInfo {
  /**
   * scroll height
   */
  _y: number
  /**
   * is scroll over threshold
   */
  _s: boolean

  /**
   * height
   */
  _h: number

  /**
   * is need paywall
   */
  _d: boolean

  /**
   * config
   */
  _c: Config

  /**
   * paywall
   */
  _p: PaywallState

  /**
   * is over free limit
   */
  _o: boolean

  /**
   * is showing
   */
  _v: boolean

  /**
   * article
   */
  _a: FoundedArticle | null

  /**
   * version
   */
  _z: string

  /**
   * show
   * @param v
   * @returns
   */
  show: (v?: boolean) => void
}

export function useDebugInfo() {
  return useAsyncState(
    pipe(
      Effect.sync(() =>
        // @ts-expect-error no type
        Option.fromNullable(window.__spph as DebugInfo),
      ),

      Effect.filterOrFail(Option.isSome),
      Effect.retry({
        schedule: Schedule.spaced(Duration.seconds(1)),
        times: 60,
      }),
      Effect.map(Option.getOrThrow),
      Effect.runPromise,
    ),
    null as unknown as DebugInfo,
  )
}
