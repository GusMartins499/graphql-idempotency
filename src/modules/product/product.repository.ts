import { desc, eq } from 'drizzle-orm'
import type { Db } from '../../db/connection.ts'
import {
  productsTable,
  type NewProduct,
  type Product,
} from '../../db/schemas/product.ts'

export const listProducts = (db: Db): Promise<Product[]> =>
  db.select().from(productsTable).orderBy(desc(productsTable.created_at))

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

export const insertProduct = async (
  db: Db,
  values: NewProduct,
): Promise<Product> => {
  const [row] = await db.insert(productsTable).values(values).returning()

  return row
}
