import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestDb } from '../../../helpers.ts'
import { insertProduct } from '../../../../src/modules/product/repositories/insert-product.ts'
import { listProducts } from '../../../../src/modules/product/repositories/list-products.ts'

describe('listProducts', () => {
  it('lists from newest to oldest', async () => {
    const db = setupTestDb()
    await insertProduct(db, {
      name: 'Old',
      price_cents: 100,
      created_at: new Date('2026-01-01'),
    })
    await insertProduct(db, {
      name: 'New',
      price_cents: 200,
      created_at: new Date('2026-02-01'),
    })

    const products = await listProducts(db)

    assert.deepEqual(
      products.map((product) => product.name),
      ['New', 'Old'],
    )
  })
})
