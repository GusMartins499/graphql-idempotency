import { int, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const idempotencyKeysTable = sqliteTable(
  'idempotency_keys',
  {
    key: text().notNull(),
    operation: text().notNull(),
    request_hash: text().notNull(),
    resource_id: text().notNull(),
    created_at: int({ mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [primaryKey({ columns: [table.key, table.operation] })],
)

export type IdempotencyKey = typeof idempotencyKeysTable.$inferSelect
export type NewIdempotencyKey = typeof idempotencyKeysTable.$inferInsert
