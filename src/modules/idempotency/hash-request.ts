import { createHash } from 'node:crypto'

export const hashRequest = (input: unknown): string =>
  createHash('sha256').update(JSON.stringify(input)).digest('hex')
