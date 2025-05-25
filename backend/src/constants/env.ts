const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }

  return value;
}

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const MONGO_URI = getEnv("MONGO_URI");
export const PORT = getEnv("PORT", "4000");
export const APP_ORIGIN = getEnv("APP_ORIGIN", "http://localhost:4000");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const JWT_ACCESS_SECRET = getEnv("JWT_ACCESS_SECRET");
export const EMAIL_SENDER = getEnv("EMAIL_SENDER",);
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");
