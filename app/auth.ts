import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface User {
  name: string;
  email: string;
}

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        token: {
          label: "Token",
          type: "text",
        },
      },
      async authorize(credentials) {
        if (credentials?.token) {
          // Validate the token with your backend if needed
          return {
            name: "User",
            email: "user@example.com",
          } as User; // Replace with actual user data
        }
        return null;
      },
    }),
  ],
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
