import type { AppSettings } from "./interfaces/Settings";

/**
 * App settings
 */
export const settings: AppSettings = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME,
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  api: {
    url: process.env.NEXT_PUBLIC_API_URL,
    auth: {
      basic: {
        secret: process.env.BASIC_SECRET,
      },
      jwt: {
        accessToken: {
          signingSecret: process.env.JWT_ACCESS_TOKEN_SIGNING_SECRET,
          expiry: process.env.JWT_ACCESS_TOKEN_EXPIRY,
        },
        refreshToken: {
          signingSecret: process.env.JWT_REFRESH_TOKEN_SIGNING_SECRET,
          expiry: process.env.JWT_REFRESH_TOKEN_EXPIRY,
        },
      },
    }
  }
}