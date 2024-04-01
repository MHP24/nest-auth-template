import { config } from 'dotenv';
import * as joi from 'joi';
config();

interface EnvVars {
  PORT: number;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRE_TEXT: string;
  JWT_REFRESH_EXPIRE_TEXT: string;
  JWT_EXPIRE_SECONDS: number;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    DB_NAME: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_REFRESH_SECRET: joi.string().required(),
    JWT_EXPIRE_TEXT: joi.string().required(),
    JWT_REFRESH_EXPIRE_TEXT: joi.string().required(),
    JWT_EXPIRE_SECONDS: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);
if (error) {
  throw new Error(error.message);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  dbName: envVars.DB_NAME,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  dbUser: envVars.DB_USER,
  dbPassword: envVars.DB_PASSWORD,
  dbUrl: envVars.DB_URL,
  jwtSecret: envVars.JWT_SECRET,
  jwtRefreshSecret: envVars.JWT_REFRESH_SECRET,
  jwtExpireText: envVars.JWT_EXPIRE_TEXT,
  jwtRefreshExpireText: envVars.JWT_REFRESH_EXPIRE_TEXT,
  jwtExpireSeconds: envVars.JWT_EXPIRE_SECONDS,
};
