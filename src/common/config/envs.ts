import { config } from 'dotenv';
import * as joi from 'joi';
config();

interface EnvVars {
  PORT: number;
  DB_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRE_TEXT: string;
  JWT_REFRESH_EXPIRE_TEXT: string;
  JWT_EXPIRE_SECONDS: number;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    DB_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_REFRESH_SECRET: joi.string().required(),
    JWT_EXPIRE_TEXT: joi.string().required(),
    JWT_REFRESH_EXPIRE_TEXT: joi.string().required(),
    JWT_EXPIRE_SECONDS: joi.number().required(),
    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_CLIENT_SECRET: joi.string().required(),
    GOOGLE_CALLBACK_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);
if (error) {
  throw new Error(error.message);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  dbUrl: envVars.DB_URL,
  jwt: {
    secret: envVars.JWT_SECRET,
    expireText: envVars.JWT_EXPIRE_TEXT,
    refreshExpireText: envVars.JWT_REFRESH_EXPIRE_TEXT,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    expireSeconds: envVars.JWT_EXPIRE_SECONDS,
  },
  googleOauth: {
    clientId: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    callbackUrl: envVars.GOOGLE_CALLBACK_URL,
  },
};
