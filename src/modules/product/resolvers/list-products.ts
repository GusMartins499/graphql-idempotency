import { GraphQLList, GraphQLNonNull, type GraphQLFieldConfig } from 'graphql'
import type { GraphQLContext } from '../../../context.ts'
import { listProducts } from '../repositories/list-products.ts'
import { ProductType } from '../type.ts'

export const products: GraphQLFieldConfig<unknown, GraphQLContext> = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProductType))),
  resolve: (_parent, _args, { db }) => listProducts(db),
}
