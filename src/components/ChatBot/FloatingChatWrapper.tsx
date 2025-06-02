"use client";

import { usePathname } from "next/navigation";
import FloatingChat from "./FloatingChat";
import { useSession } from "next-auth/react";

export function FloatingChatWrapper() {
  const { data: session, status } = useSession();

  const pathname = usePathname();

  if (
    pathname === "/agent-ai" ||
    pathname === "/resources/calculators" ||
    pathname === "/analytics" ||
    pathname === "/my-meetings" ||
    (pathname.startsWith("/contacts/") && pathname.includes("/quotes/")) ||
    status === "loading"
  ) {
    return null;
  }

  return status === "authenticated" ? <FloatingChat /> : null;
}
