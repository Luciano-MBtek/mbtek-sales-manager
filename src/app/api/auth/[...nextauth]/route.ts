import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import HubspotProvider from "next-auth/providers/hubspot";

declare module "next-auth" {
  interface Session {
    user: {
      accessLevel?: string;
    } & DefaultSession["user"];
  }
}

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    HubspotProvider({
      clientId: process.env.HUBSPOT_CLIENT_ID as string,
      clientSecret: process.env.HUBSPOT_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email ?? undefined },
      });

      if (existingUser) {
        // Allow sign-in
        return true;
      } else {
        // Deny sign-in
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        // Fetch the user's accessLevel from the database
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email ?? undefined },
        });
        if (dbUser) {
          token.accessLevel = dbUser.accessLevel;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.accessLevel) {
        session.user.accessLevel = token.accessLevel as string;
      }
      return session;
    },
  },
  /*  pages: {
    signIn: "/auth/signin", // Optional: Custom sign-in page
    error: "/auth/error", // Optional: Error page
  }, */
});

export { handler as GET, handler as POST };
