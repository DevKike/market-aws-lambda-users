import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';

const signInSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
  additionalProperties: false,
};

export const signInValidator = validator({
  eventSchema: transpileSchema({
    type: 'object',
    properties: {
      body: signInSchema,
    },
  }),
});
