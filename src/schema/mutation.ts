import { GraphQLObjectType } from 'graphql'
import type { GraphQLContext } from '../context.ts'
import { createProduct } from '../modules/product/resolvers/create-product.ts'

export const MutationType = new GraphQLObjectType<unknown, GraphQLContext>({
  name: 'Mutation',
  fields: {
    createProduct,
  },
})
