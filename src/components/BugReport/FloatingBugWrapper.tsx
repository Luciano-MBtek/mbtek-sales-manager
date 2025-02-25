"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import FloatingBugReport from "./FloatingBugReport";

export function FloatingBugWrapper() {
  const { data: session, status } = useSession();

  const pathname = usePathname();

  if (pathname !== "/" || status === "loading") {
    return null;
  }

  return status === "authenticated" ? <FloatingBugReport /> : null;
}
