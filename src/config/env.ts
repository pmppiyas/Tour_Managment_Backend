import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  DCRYPT_SALT_ROUND: string;
  JWT_ACCESS_EXPIRED: string;
  JWT_ACCESS_TOKEN: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRED: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  EXPRESS_SESSION_SECRET: string;
  FRONTENT_URL: string;
}

const loadEnvVars = (): EnvConfig => {
  const requiredEnvVars: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "DCRYPT_SALT_ROUND",
    "JWT_ACCESS_EXPIRED",
    "JWT_ACCESS_TOKEN",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRED",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "EXPRESS_SESSION_SECRET",
    "FRONTENT_URL",
  ];
  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variable ${key}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN as string,
    JWT_ACCESS_EXPIRED: process.env.JWT_ACCESS_EXPIRED as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRED: process.env.JWT_REFRESH_EXPIRED as string,
    DCRYPT_SALT_ROUND: process.env.DCRYPT_SALT_ROUND as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONTENT_URL: process.env.FRONTENT_URL as string,
  };
};

export const envVars = loadEnvVars();
