import { readFileSync } from 'node:fs'

export const rootTypeDefs = readFileSync(
  new URL('./root.graphql', import.meta.url),
  'utf8',
)
