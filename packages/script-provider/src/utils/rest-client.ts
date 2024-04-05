import { initClient, initContract } from '@ts-rest/core'
import { z } from 'zod'
import type { Environment } from './api-host-url'
import { getApiHostUrl } from './api-host-url'

const c = initContract()

export const contract = c.router({
  getTenantState: c.query({
    method: 'GET',
    path: '/client/:clientId/rest/v1/publication/state',
    pathParams: z.object({
      clientId: z.string().min(1),
    }),
    responses: {
      200: z.object({ state: z.enum(['uninitialized', 'online', 'deleted', 'not-found']) }),
    },
  }),
})

export function createClient(environment: Environment) {
  return initClient(contract, {
    baseUrl: getApiHostUrl(environment),
    baseHeaders: {},
  })
}
