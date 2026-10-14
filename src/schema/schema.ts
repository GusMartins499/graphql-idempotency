import { GraphQLSchema } from 'graphql'
import { MutationType } from './mutation.ts'
import { QueryType } from './query.ts'

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
})
