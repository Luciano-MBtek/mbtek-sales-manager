// src/types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      accessLevel?: string;
      id?: string;
      hubspotOwnerId?: string;
    } & DefaultSession["user"];
  }
}

export {};
