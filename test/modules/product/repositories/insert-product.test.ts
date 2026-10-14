import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestDb } from '../../../helpers.ts'
import { insertProduct } from '../../../../src/modules/product/repositories/insert-product.ts'

describe('insertProduct', () => {
  it('insere o produto e devolve a linha com id e timestamps', async () => {
    const db = setupTestDb()

    const product = await insertProduct(db, {
      name: 'Caneca',
      price_cents: 2990,
    })

    assert.equal(product.name, 'Caneca')
    assert.equal(product.price_cents, 2990)
    assert.ok(product.id)
    assert.ok(product.created_at instanceof Date)
  })
})
