import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestDb } from '../../../helpers.ts'
import { getProductById } from '../../../../src/modules/product/repositories/get-product-by-id.ts'
import { insertProduct } from '../../../../src/modules/product/repositories/insert-product.ts'

describe('getProductById', () => {
  it('returns the product by id', async () => {
    const db = setupTestDb()
    const inserted = await insertProduct(db, {
      name: 'Mug',
      price_cents: 2990,
    })

    const product = await getProductById(db, inserted.id)

    assert.deepEqual(product, inserted)
  })

  it('returns undefined when the id does not exist', async () => {
    const db = setupTestDb()

    const product = await getProductById(db, 'non-existent')

    assert.equal(product, undefined)
  })
})
