import { GraphQLID, GraphQLNonNull, type GraphQLFieldConfig } from 'graphql'
import type { GraphQLContext } from '../../../context.ts'
import { getProductById } from '../repositories/get-product-by-id.ts'
import { ProductType } from '../type.ts'

type FindProductArgs = {
  id: string
}

export const product: GraphQLFieldConfig<
  unknown,
  GraphQLContext,
  FindProductArgs
> = {
  type: ProductType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_parent, { id }, { db }) =>
    (await getProductById(db, id)) ?? null,
}
