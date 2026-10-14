import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestApp } from '../../../helpers.ts'

type ProductPayload = {
  id: string
  name: string
  priceCents: number
  createdAt: string
}

const CREATE_PRODUCT = /* GraphQL */ `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      priceCents
      createdAt
    }
  }
`

const PRODUCTS = /* GraphQL */ `
  query Products {
    products {
      id
    }
  }
`

describe('createProduct', () => {
  it('creates a product', async () => {
    const { gql } = setupTestApp()

    const result = await gql<{ createProduct: ProductPayload }>(
      CREATE_PRODUCT,
      { input: { name: 'Mug', priceCents: 2990 } },
    )

    assert.equal(result.errors, undefined)
    assert.equal(result.data?.createProduct.name, 'Mug')
    assert.equal(result.data?.createProduct.priceCents, 2990)
  })

  it('with the same Idempotency-Key, creates a single product and replays the response', async () => {
    const { gql } = setupTestApp()
    const variables = { input: { name: 'Mug', priceCents: 2990 } }
    const headers = { 'idempotency-key': 'b3f1c0de-0000-4000-8000-000000000001' }

    const first = await gql<{ createProduct: ProductPayload }>(
      CREATE_PRODUCT,
      variables,
      headers,
    )
    const second = await gql<{ createProduct: ProductPayload }>(
      CREATE_PRODUCT,
      variables,
      headers,
    )
    const list = await gql<{ products: { id: string }[] }>(PRODUCTS)

    assert.equal(first.errors, undefined)
    assert.deepEqual(second, first)
    assert.equal(list.data?.products.length, 1)
  })
})
