/**
 * App settings interface
 */
export interface AppSettings {
  app: {
    name: string;
    url: string;
  };
  api: {
    url: string;
    auth: {
      basic: {
        secret: string;
      };
      jwt: {
        accessToken: {
          signingSecret: string;
          expiry: string;
        };
        refreshToken: {
          signingSecret: string;
          expiry: string;
        };
      };
    };
  };
}
