import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestDb } from '../../../helpers.ts'
import { insertIdempotencyKey } from '../../../../src/modules/idempotency/repositories/insert-idempotency-key.ts'

const values = {
  key: 'key-1',
  operation: 'createProduct',
  request_hash: 'hash',
  resource_id: 'product-1',
}

describe('insertIdempotencyKey', () => {
  it('rejects the same key twice for the same operation', () => {
    const db = setupTestDb()
    insertIdempotencyKey(db, values)

    assert.throws(() => insertIdempotencyKey(db, values))
  })

  it('accepts the same key for a different operation', () => {
    const db = setupTestDb()
    insertIdempotencyKey(db, values)

    assert.doesNotThrow(() =>
      insertIdempotencyKey(db, { ...values, operation: 'otherOperation' }),
    )
  })
})
