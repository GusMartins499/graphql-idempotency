import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'

const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      ping: String!
    }
  `,
  resolvers: {
    Query: {
      ping: () => 'pong',
    },
  },
})

const yoga = createYoga({ schema })

createServer(yoga).listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}/graphql`)
})