import { createYoga } from 'graphql-yoga'
import { db } from './db/connection.ts'
import { schema } from './schema.ts'

export const yoga = createYoga({
  schema,
  context: () => ({ db }),
})
