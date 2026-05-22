import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

const env = {
  PORT: requireEnv('PORT'),
  DATABASE_URL: requireEnv('DATABASE_URL'),
  API_URL: requireEnv('API_URL'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: requireEnv('JWT_EXPIRES_IN'),
  REFRESH_EXPIRES_DAYS: requireEnv('REFRESH_EXPIRES_DAYS'),
  REDIS_HOST: requireEnv('REDIS_HOST'),
  REDIS_PORT: requireEnv('REDIS_PORT'),
  REDIS_PASSWORD: requireEnv('REDIS_PASSWORD'),
  NODE_ENV: requireEnv('NODE_ENV'),
} as const;

export default env;