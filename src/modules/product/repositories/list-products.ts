import { desc } from 'drizzle-orm'
import type { Db } from '../../../db/connection.ts'
import { productsTable, type Product } from '../../../db/schemas/product.ts'

export const listProducts = (db: Db): Promise<Product[]> =>
  db.select().from(productsTable).orderBy(desc(productsTable.created_at))
