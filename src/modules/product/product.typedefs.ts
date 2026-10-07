import { readFileSync } from 'node:fs'

export const productTypeDefs = readFileSync(
  new URL('./product.graphql', import.meta.url),
  'utf8',
)
