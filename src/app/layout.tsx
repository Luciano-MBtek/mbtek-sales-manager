import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { getQueryClient } from "@/lib/query";
import { getAllProducts } from "@/actions/getAllProducts";
import { getAllOwners } from "@/actions/getAllOwners";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AccessDeniedToast } from "@/components/AccessDeniedToast";
import { FloatingChatWrapper } from "@/components/ChatBot/FloatingChatWrapper";
import { FloatingBugWrapper } from "@/components/BugReport/FloatingBugWrapper";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "MBtek Sales Manager",
  description: "Sales Manager for MBtek",
  icons: {
    icon: "/mbtek-logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["allProducts"],
    queryFn: getAllProducts,
  });

  await queryClient.prefetchQuery({
    queryKey: ["allOwners"],
    queryFn: getAllOwners,
  });

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <AccessDeniedToast />
            <AppSidebar />
            <main className="flex w-full ">
              <SidebarTrigger />
              {children}
            </main>
            <FloatingChatWrapper />
            <FloatingBugWrapper />
          </HydrationBoundary>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
