import type { Db } from './db/connection.ts'

export type GraphQLContext = {
  db: Db
}
