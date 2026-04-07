import type { Commander } from "./interfaces/Commander";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      commander: Commander;
    };
  }
}
