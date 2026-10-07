import type { GraphQLContext } from '../../context.ts'
import type { Product } from '../../db/schemas/product.ts'
import {
  getProductById,
  insertProduct,
  listProducts,
} from './product.repository.ts'

type CreateProductInput = {
  name: string
  priceCents: number
}

const toProduct = (row: Product) => ({
  id: row.id,
  name: row.name,
  priceCents: row.price_cents,
  createdAt: row.created_at.toISOString(),
})

export const productResolvers = {
  Query: {
    products: async (
      _parent: unknown,
      _args: unknown,
      { db }: GraphQLContext,
    ) => {
      const rows = await listProducts(db)

      return rows.map(toProduct)
    },

    product: async (
      _parent: unknown,
      { id }: { id: string },
      { db }: GraphQLContext,
    ) => {
      const row = await getProductById(db, id)

      return row ? toProduct(row) : null
    },
  },

  Mutation: {
    createProduct: async (
      _parent: unknown,
      { input }: { input: CreateProductInput },
      { db }: GraphQLContext,
    ) => {
      const row = await insertProduct(db, {
        name: input.name,
        price_cents: input.priceCents,
      })

      return toProduct(row)
    },
  },
}
