import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import type { GraphQLContext } from '../../context.ts'
import type { Product } from '../../db/schemas/product.ts'

export const ProductType = new GraphQLObjectType<Product, GraphQLContext>({
  name: 'Product',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    priceCents: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (product) => product.price_cents,
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (product) => product.created_at.toISOString(),
    },
  },
})
