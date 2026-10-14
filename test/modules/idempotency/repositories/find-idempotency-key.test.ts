import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestDb } from '../../../helpers.ts'
import { findIdempotencyKey } from '../../../../src/modules/idempotency/repositories/find-idempotency-key.ts'
import { insertIdempotencyKey } from '../../../../src/modules/idempotency/repositories/insert-idempotency-key.ts'

describe('findIdempotencyKey', () => {
  it('returns the stored key for the operation', () => {
    const db = setupTestDb()
    insertIdempotencyKey(db, {
      key: 'key-1',
      operation: 'createProduct',
      request_hash: 'hash',
      resource_id: 'product-1',
    })

    const found = findIdempotencyKey(db, 'key-1', 'createProduct')

    assert.equal(found?.resource_id, 'product-1')
    assert.equal(found?.request_hash, 'hash')
  })

  it('returns undefined for the same key under another operation', () => {
    const db = setupTestDb()
    insertIdempotencyKey(db, {
      key: 'key-1',
      operation: 'createProduct',
      request_hash: 'hash',
      resource_id: 'product-1',
    })

    const found = findIdempotencyKey(db, 'key-1', 'otherOperation')

    assert.equal(found, undefined)
  })
})
