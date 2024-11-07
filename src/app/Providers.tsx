"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
