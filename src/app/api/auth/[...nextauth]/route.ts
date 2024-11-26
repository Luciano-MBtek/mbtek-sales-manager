import NextAuth, { DefaultSession, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import HubspotProvider from "next-auth/providers/hubspot";
import { User } from "next-auth";
import { db } from "@/lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      accessLevel?: string;
      id?: string;
    } & DefaultSession["user"];
  }
}

export const authOptions = {
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
    async signIn({ user }: { user: User }) {
      const existingUser = await db.user.findUnique({
        where: { email: user.email ?? undefined },
      });

      if (existingUser) {
        return true;
      } else {
        return false;
      }
    },
    async jwt({ token, user }: { token: any; user: User }) {
      if (user) {
        token.email = user.email;

        const dbUser = await db.user.findUnique({
          where: { email: user.email ?? undefined },
        });
        if (dbUser) {
          console.log("DBUSER:", dbUser);
          token.accessLevel = dbUser.accessLevel;
          token.id = dbUser.id.toString();
          console.log("DBID:", token.id);
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (session.user && token.accessLevel) {
        session.user.accessLevel = token.accessLevel as string;
      }
      if (token.id) {
        session.user.id = token.id.toString();
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
