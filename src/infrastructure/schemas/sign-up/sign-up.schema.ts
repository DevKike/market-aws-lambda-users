import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';

const signUpSchema = {
  type: 'object',
  required: ['name', 'email', 'password', 'phone'],
  properties: {
    name: {
      type: 'string',
      minLength: 5,
    },
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
    phone: {
      type: 'string',
      minLength: 10,
    },
  },
  additionalProperties: false,
};

export const signUpValidator = validator({
  eventSchema: transpileSchema({
    type: 'object',
    properties: {
      body: signUpSchema,
    },
  }),
});
