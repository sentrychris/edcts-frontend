declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Environment
      NODE_ENV: "development" | "production";

      // Debug
      DEBUG: string;

      // App info
      NEXT_PUBLIC_APP_NAME: string;
      NEXT_PUBLIC_APP_URL: string;

      // API info
      NEXT_PUBLIC_API_URL: string;

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