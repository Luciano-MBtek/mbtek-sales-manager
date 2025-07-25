"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query";
import { SidebarProvider } from "@/components/ui/sidebar";
import SessionErrorRedirect from "./SessionErrorRedirect";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          {children}
          <SessionErrorRedirect />
        </SidebarProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
