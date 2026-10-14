import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  type GraphQLFieldConfig,
} from 'graphql'
import type { GraphQLContext } from '../../../context.ts'
import { insertProduct } from '../repositories/insert-product.ts'
import { ProductType } from '../type.ts'

type CreateProductArgs = {
  input: {
    name: string
    priceCents: number
  }
}

const CreateProductInputType = new GraphQLInputObjectType({
  name: 'CreateProductInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    priceCents: { type: new GraphQLNonNull(GraphQLInt) },
  },
})

export const createProduct: GraphQLFieldConfig<
  unknown,
  GraphQLContext,
  CreateProductArgs
> = {
  type: new GraphQLNonNull(ProductType),
  args: {
    input: { type: new GraphQLNonNull(CreateProductInputType) },
  },
  resolve: (_parent, { input }, { db }) =>
    insertProduct(db, {
      name: input.name,
      price_cents: input.priceCents,
    }),
}
