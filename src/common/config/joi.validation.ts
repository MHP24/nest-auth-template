import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  PORT: Joi.number().default(5001),
  DB_NAME: Joi.string(),
  DB_PORT: Joi.number(),
  DB_USER: Joi.string(),
  DB_PASSWORD: Joi.string(),
  DB_URL: Joi.string(),
  JWT_SECRET: Joi.string(),
});
