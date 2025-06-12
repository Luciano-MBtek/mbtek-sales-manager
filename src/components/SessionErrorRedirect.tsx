"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function SessionErrorRedirect() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/api/auth/error?error=RefreshAccessTokenError" });
    }
  }, [session]);

  return null;
}
