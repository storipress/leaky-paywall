import { z } from 'zod'
import { P, match } from 'ts-pattern'

export const EnvironmentSchema = z.enum(['production', 'staging', 'development'])

export type Environment = z.infer<typeof EnvironmentSchema>

export function getEnvironmentFromClientId(clientId: string): Environment {
  return match(clientId)
    .returnType<Environment>()
    .with(P.string.startsWith('P'), () => 'production')
    .with(P.string.startsWith('S'), () => 'staging')
    .with(P.string.startsWith('D'), () => 'development')
    .otherwise(() => 'development')
}

const apiHostMap: Record<Environment, string> = {
  production: 'https://api.stori.press',
  staging: 'https://api.storipress.pro',
  development: 'https://api.storipress.dev',
}

export function getApiHostUrl(environment: Environment): string {
  return apiHostMap[environment]
}
