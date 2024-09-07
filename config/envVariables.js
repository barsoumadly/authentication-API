import dotenv from 'dotenv';

dotenv.config();

export const envVariables = {
  API_URL: process.env.API_URL,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_AT: process.env.JWT_EXPIRES_AT,
  MAILTRAP_TOKEN: process.env.MAILTRAP_TOKEN,
  MAILTRAP_TEMPLATE_ID: process.env.MAILTRAP_TEMPLATE_ID,
};
