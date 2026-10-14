import { and, eq } from 'drizzle-orm'
import type { DbExecutor } from '../../../db/connection.ts'
import {
  idempotencyKeysTable,
  type IdempotencyKey,
} from '../../../db/schemas/idempotency-key.ts'

export const findIdempotencyKey = (
  db: DbExecutor,
  key: string,
  operation: string,
): IdempotencyKey | undefined =>
  db
    .select()
    .from(idempotencyKeysTable)
    .where(
      and(
        eq(idempotencyKeysTable.key, key),
        eq(idempotencyKeysTable.operation, operation),
      ),
    )
    .get()
