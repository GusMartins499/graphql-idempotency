import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  type GraphQLFieldConfig,
} from 'graphql'
import type { GraphQLContext } from '../../../context.ts'
import {
  idempotencyKeyRequiredError,
  idempotencyKeyReusedError,
} from '../../idempotency/errors.ts'
import { hashRequest } from '../../idempotency/hash-request.ts'
import { findIdempotencyKey } from '../../idempotency/repositories/find-idempotency-key.ts'
import { insertIdempotencyKey } from '../../idempotency/repositories/insert-idempotency-key.ts'
import { getProductById } from '../repositories/get-product-by-id.ts'
import { insertProduct } from '../repositories/insert-product.ts'
import { ProductType } from '../type.ts'

const OPERATION = 'createProduct'

type CreateProductArgs = {
  input: {
    name: string
    priceCents: number
  }
}

const CreateProductInputType = new GraphQLInputObjectType({
  name: 'CreateProductInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    priceCents: { type: new GraphQLNonNull(GraphQLInt) },
  },
})

export const createProduct: GraphQLFieldConfig<
  unknown,
  GraphQLContext,
  CreateProductArgs
> = {
  type: new GraphQLNonNull(ProductType),
  args: {
    input: { type: new GraphQLNonNull(CreateProductInputType) },
  },
  resolve: (_parent, { input }, { db, idempotencyKey }) => {
    if (!idempotencyKey) {
      throw idempotencyKeyRequiredError()
    }

    const values = { name: input.name, price_cents: input.priceCents }
    const requestHash = hashRequest(input)

    // Sync transaction: it runs start to finish without yielding to other
    // requests, so two concurrent calls with the same key cannot interleave.
    return db.transaction((tx) => {
      const existing = findIdempotencyKey(tx, idempotencyKey, OPERATION)

      if (existing) {
        if (existing.request_hash !== requestHash) {
          throw idempotencyKeyReusedError()
        }

        return getProductById(tx, existing.resource_id)
      }

      const product = insertProduct(tx, values)

      insertIdempotencyKey(tx, {
        key: idempotencyKey,
        operation: OPERATION,
        request_hash: requestHash,
        resource_id: product.id,
      })

      return product
    })
  },
}
