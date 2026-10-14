import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import type { GraphQLContext } from '../context.ts'
import { product } from '../modules/product/resolvers/find-product.ts'
import { products } from '../modules/product/resolvers/list-products.ts'

export const QueryType = new GraphQLObjectType<unknown, GraphQLContext>({
  name: 'Query',
  fields: {
    ping: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: () => 'pong',
    },
    products,
    product,
  },
})
