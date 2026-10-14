import { eq } from 'drizzle-orm'
import type { DbExecutor } from '../../../db/connection.ts'
import { productsTable, type Product } from '../../../db/schemas/product.ts'

export const getProductById = (
  db: DbExecutor,
  id: string,
): Product | undefined =>
  db.select().from(productsTable).where(eq(productsTable.id, id)).get()
