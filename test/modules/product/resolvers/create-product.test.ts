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
      { 'idempotency-key': 'b3f1c0de-0000-4000-8000-000000000000' },
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

  it('with the same Idempotency-Key and a different input, returns an error and creates nothing', async () => {
    const { gql } = setupTestApp()
    const headers = { 'idempotency-key': 'b3f1c0de-0000-4000-8000-000000000002' }

    await gql(CREATE_PRODUCT, { input: { name: 'Mug', priceCents: 2990 } }, headers)
    const second = await gql<{ createProduct: ProductPayload }>(
      CREATE_PRODUCT,
      { input: { name: 'Mug', priceCents: 1990 } },
      headers,
    )
    const list = await gql<{ products: { id: string }[] }>(PRODUCTS)

    assert.equal(second.data, null)
    assert.equal(second.errors?.[0]?.extensions?.code, 'IDEMPOTENCY_KEY_REUSED')
    assert.equal(list.data?.products.length, 1)
  })

  it('with different Idempotency-Keys, creates one product per key', async () => {
    const { gql } = setupTestApp()
    const variables = { input: { name: 'Mug', priceCents: 2990 } }

    await gql(CREATE_PRODUCT, variables, { 'idempotency-key': 'key-1' })
    await gql(CREATE_PRODUCT, variables, { 'idempotency-key': 'key-2' })
    const list = await gql<{ products: { id: string }[] }>(PRODUCTS)

    assert.equal(list.data?.products.length, 2)
  })

  it('without an Idempotency-Key, returns an error and creates nothing', async () => {
    const { gql } = setupTestApp()

    const result = await gql<{ createProduct: ProductPayload }>(
      CREATE_PRODUCT,
      { input: { name: 'Mug', priceCents: 2990 } },
    )
    const list = await gql<{ products: { id: string }[] }>(PRODUCTS)

    assert.equal(result.data, null)
    assert.equal(result.errors?.[0]?.extensions?.code, 'IDEMPOTENCY_KEY_REQUIRED')
    assert.equal(list.data?.products.length, 0)
  })

  it('with concurrent calls using the same Idempotency-Key, creates a single product', async () => {
    const { gql } = setupTestApp()
    const variables = { input: { name: 'Mug', priceCents: 2990 } }
    const headers = { 'idempotency-key': 'b3f1c0de-0000-4000-8000-000000000003' }

    const responses = await Promise.all(
      Array.from({ length: 5 }, () =>
        gql<{ createProduct: ProductPayload }>(CREATE_PRODUCT, variables, headers),
      ),
    )
    const list = await gql<{ products: { id: string }[] }>(PRODUCTS)

    for (const response of responses) {
      assert.deepEqual(response, responses[0])
    }
    assert.equal(list.data?.products.length, 1)
  })
})
