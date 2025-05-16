import { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import HubspotProvider from "next-auth/providers/hubspot";
import { db } from "@/lib/db";
import { getHubspotOwnerId } from "@/actions/getOwnerId";
import { User } from "next-auth";
import { refreshGoogleAccessToken } from "./tokenUtils";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope:
            "openid profile email https://www.googleapis.com/auth/calendar",
          access_type: "offline",
          prompt: "consent",
        },
      },
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
    async jwt({
      token,
      user,
      account,
    }: {
      token: any;
      user: User;
      account: any;
    }) {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
        token.provider = account.provider;

        if (account.provider === "google") {
          token.refreshToken = account.refresh_token;
          token.accessTokenExpires = account.expires_at
            ? account.expires_at * 1000 // Convert to milliseconds
            : Date.now() + 3600 * 1000; // 1 hour by default
        }
      }
      const isGoogle = token.provider === "google";
      const shouldRefresh =
        isGoogle &&
        token.accessTokenExpires &&
        Date.now() > token.accessTokenExpires - 5 * 60 * 1000;

      // If it's a Google token, it's about to expire, and we have a refresh token, we renew it
      if (shouldRefresh && token.refreshToken) {
        return await refreshGoogleAccessToken(token);
      }
      if (user) {
        token.email = user.email;
        if (user.email) {
          const ownerId = await getHubspotOwnerId(user.email);

          if (ownerId) {
            token.hubspotOwnerId = ownerId;
          }
        }

        const dbUser = await db.user.findUnique({
          where: { email: user.email ?? undefined },
        });
        if (dbUser) {
          token.accessLevel = dbUser.accessLevel;
          token.id = dbUser.id.toString();
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
      if (token.hubspotOwnerId) {
        session.user.hubspotOwnerId = token.hubspotOwnerId;
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
      if (token.error) {
        session.error = token.error;
      }
      return session;
    },
  },
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};
