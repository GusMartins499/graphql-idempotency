import type { DbExecutor } from '../../../db/connection.ts'
import {
  productsTable,
  type NewProduct,
  type Product,
} from '../../../db/schemas/product.ts'

export const insertProduct = (db: DbExecutor, values: NewProduct): Product =>
  db.insert(productsTable).values(values).returning().get()
