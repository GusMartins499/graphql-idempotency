import { randomUUID } from 'node:crypto'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const productsTable = sqliteTable('products', {
  id: text()
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text().notNull(),
  price_cents: int().notNull(),
  created_at: int({ mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: int({ mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
})

export type Product = typeof productsTable.$inferSelect
export type NewProduct = typeof productsTable.$inferInsert