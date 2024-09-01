import type { NextAuthConfig } from "next-auth";
import type { AuthUser, AuthSession } from "./interfaces/Auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        user: {
          label: "User",
          type: "text",
        },
        token: {
          label: "Token",
          type: "text",
        },
      },
      async authorize(credentials) {
        if (credentials?.user && credentials?.token) {
          const user = (JSON.parse(credentials.user as string) as AuthUser);

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            commander: user.commander,
            frontier_user: user.frontier_user,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any , token: any }) {
      if (token && session.user) {
        session.user.name = token.commander.name
        session.user.commander = token.commander;
      }

      return session as AuthSession;
    },
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.commander = user.commander;
      }

      return token;
    },
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
