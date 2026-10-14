import { GraphQLError } from 'graphql'

export const idempotencyKeyRequiredError = () =>
  new GraphQLError('The Idempotency-Key header is required', {
    extensions: { code: 'IDEMPOTENCY_KEY_REQUIRED' },
  })

export const idempotencyKeyReusedError = () =>
  new GraphQLError(
    'This Idempotency-Key was already used with a different input',
    { extensions: { code: 'IDEMPOTENCY_KEY_REUSED' } },
  )
