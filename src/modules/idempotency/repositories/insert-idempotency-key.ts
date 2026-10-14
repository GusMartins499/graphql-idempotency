import type { DbExecutor } from '../../../db/connection.ts'
import {
  idempotencyKeysTable,
  type NewIdempotencyKey,
} from '../../../db/schemas/idempotency-key.ts'

export const insertIdempotencyKey = (
  db: DbExecutor,
  values: NewIdempotencyKey,
): void => {
  db.insert(idempotencyKeysTable).values(values).run()
}
