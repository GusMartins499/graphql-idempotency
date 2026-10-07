import { createSchema } from 'graphql-yoga'
import type { GraphQLContext } from './context.ts'
import { productResolvers } from './modules/product/product.resolvers.ts'
import { productTypeDefs } from './modules/product/product.typedefs.ts'
import { rootTypeDefs } from './root.typedefs.ts'
import { rootResolvers } from './root.resolvers.ts'

export const schema = createSchema<GraphQLContext>({
  typeDefs: [rootTypeDefs, productTypeDefs],
  resolvers: [rootResolvers, productResolvers],
})
