import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://api.storipress.dev/graphql',
  documents: ['./queries/*.gql.ts'],
  ignoreNoDocuments: true, // for better experience with the watcher
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
  generates: {
    './gql/': {
      preset: 'client',
      config: {
        useTypeImports: true,
        scalars: {
          JSON: 'string',
          EmailString: 'string',
          DateTime: 'string',
          Date: 'string',
        },
      },
    },
  },
}

export default config
