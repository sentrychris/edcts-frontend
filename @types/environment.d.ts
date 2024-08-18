declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Environment
      NODE_ENV: "development" | "production";

      // Debug
      DEBUG: string;

      // App info
      APP_NAME: string;
      APP_URL: string;

      // API info
      API_URL: string;

      // Basic auth secret
      BASIC_SECRET: string;

      // JWT access token signing key and expiry
      JWT_ACCESS_TOKEN_SIGNING_SECRET: string;
      JWT_ACCESS_TOKEN_EXPIRY: string;

      // JWT refresh token signing key and expiry
      JWT_REFRESH_TOKEN_SIGNING_SECRET: string;
      JWT_REFRESH_TOKEN_EXPIRY: string;

      // Game logs directory
      LOGS_SOURCE_DIR: string;
    }
  }
}

export {};