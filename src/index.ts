import { createServer } from 'node:http'
import { yoga } from './yoga.ts'

createServer(yoga).listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}/graphql`)
})