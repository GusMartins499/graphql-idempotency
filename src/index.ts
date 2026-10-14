import { createServer } from 'node:http'
import { createDb } from './db/connection.ts'
import { createApp } from './yoga.ts'

const db = createDb(process.env.DB_FILE_NAME ?? 'sqlite.db')

createServer(createApp(db)).listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}/graphql`)
})
