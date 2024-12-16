// src/types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      accessLevel?: string;
      id?: string;
      hubspotOwnerId?: string;
    } & DefaultSession["user"];
  }
}

export {}; // Asegura que el archivo sea tratado como un módulo
