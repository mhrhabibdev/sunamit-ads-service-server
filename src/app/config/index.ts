import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  BCRYPT_SALt_ROUNDS: process.env.BCRYPT_SALt_ROUNDS,
  JWT: {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
    JWT_RESET_PASSWORD_SECRET: process.env.JWT_RESET_PASSWORD_SECRET,
    JWT_RESET_PASSWORD_EXPIRES_IN: process.env.JWT_RESET_PASSWORD_EXPIRES_IN,
  },
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_FROM_NAME: process.env.SMTP_FROM_NAME,
  RESET_PASSWORD_LINK: process.env.RESET_PASSWORD_LINK,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_MAIL: process.env.SMTP_MAIL,


  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
};
