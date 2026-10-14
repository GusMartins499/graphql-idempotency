import { eq } from 'drizzle-orm'
import type { Db } from '../../../db/connection.ts'
import { productsTable, type Product } from '../../../db/schemas/product.ts'

export const getProductById = async (
  db: Db,
  id: string,
): Promise<Product | undefined> => {
  const [row] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id))
    .limit(1)

  return row
}
