import dotenv from 'dotenv';

dotenv.config();

export { default as connectDB } from './database.js';

export const NODE_ENV: string = process.env.NODE_ENV || 'development';
export const PORT: string | number = process.env.PORT || 5000;

export const DATABASE_URL: string = process.env.DATABASE_URL || 'mysql://user:password@localhost:3306/mydb';

export const JWT_SECRET: string = process.env.JWT_SECRET || 'votre_super_secret_jwt_encore_plus_secret';
export const LOG_LEVEL: string = process.env.LOG_LEVEL || 'info';

if (!DATABASE_URL && NODE_ENV !== 'test') {
    console.error("FATAL ERROR: DATABASE_URL is not defined in .env file.");
}
if (!JWT_SECRET && NODE_ENV !== 'test') {
    console.warn("WARNING: JWT_SECRET is not defined in .env file. Using a default (unsafe) secret.");
}