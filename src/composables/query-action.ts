import { noop } from 'remeda'
import type { AuthAPI } from './login'
import { useAuth } from './login'

export interface RouterLike {
  push: (url: string) => void
  currentRoute: {
    fullPath: string
    path: string
    query: Record<string, string | string[]>
  }
}

interface UseQueryActionInput {
  auth?: AuthAPI
  router?: RouterLike
}

function getCurrentRoute() {
  const { search } = location
  const searchParams = new URLSearchParams(search)
  const query = Object.fromEntries(searchParams.entries())

  return {
    fullPath: location.href,
    path: location.pathname,
    query,
  }
}

const locationRouter: RouterLike = {
  push(path: string) {
    location.href = path
  },

  get currentRoute() {
    return getCurrentRoute()
  },
}

export function useQueryAction({
  auth: { isAuth, onVerifyEmail, onSignInSubscriber } = useAuth(),
  router = locationRouter,
}: UseQueryActionInput = {}) {
  const cache: { [key: string]: Promise<{ result: boolean; action: string | null }> | undefined } = {}
  const actions: Record<string, (token: string) => Promise<boolean>> = {
    'verify-email': onVerifyEmail,
    'sign-in': onSignInSubscriber,
  }
  const callAction = async (action: string, token: string) => {
    if (action && token && !Array.isArray(action) && !Array.isArray(token)) {
      const performAction = actions[action] || noop

      const res = await performAction(token)
      if (res) {
        router?.push(router.currentRoute.path)
        return { result: res, action }
      } else {
        setTimeout(() => {
          if (isAuth.value) {
            router?.push(router.currentRoute.path)
          }
        }, 2000)
      }
    }

    return { result: true, action: null }
  }
  return () => {
    const { action, token } = router?.currentRoute.query ?? {}
    if (action && token) {
      const key = `${action.toString()} ${token.toString()}`
      if (cache[key] === undefined) {
        cache[key] = callAction(action.toString(), token.toString())
        cache[key]?.finally(() => (cache[key] = undefined))
      }

      return cache[key]
    }
  }
}
