import type { Db } from '../../../db/connection.ts'
import {
  productsTable,
  type NewProduct,
  type Product,
} from '../../../db/schemas/product.ts'

export const insertProduct = async (
  db: Db,
  values: NewProduct,
): Promise<Product> => {
  const [row] = await db.insert(productsTable).values(values).returning()

  return row
}
