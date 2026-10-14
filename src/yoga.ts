import { createYoga } from 'graphql-yoga'
import type { Db } from './db/connection.ts'
import { schema } from './schema.ts'

export const createApp = (db: Db) =>
  createYoga({
    schema,
    context: () => ({ db }),
  })
