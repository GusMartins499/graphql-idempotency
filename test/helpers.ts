import { migrate } from 'drizzle-orm/node-sqlite/migrator'
import { createDb, type Db } from '../src/db/connection.ts'
import { createApp } from '../src/yoga.ts'

type GraphQLResponse<T> = {
  data?: T
  errors?: { message: string; extensions?: Record<string, unknown> }[]
}

export const setupTestDb = (): Db => {
  const db = createDb(':memory:')
  migrate(db, {
    migrationsFolder: new URL('../src/db/migrations', import.meta.url).pathname,
  })

  return db
}

export const setupTestApp = () => {
  const db = setupTestDb()
  const app = createApp(db)

  const gql = async <T>(
    query: string,
    variables?: Record<string, unknown>,
    headers?: Record<string, string>,
  ): Promise<GraphQLResponse<T>> => {
    const response = await app.fetch('http://localhost/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify({ query, variables }),
    })

    return response.json() as Promise<GraphQLResponse<T>>
  }

  return { gql }
}
