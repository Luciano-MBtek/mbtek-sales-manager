import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/Providers";
import { Toaster } from "@/components/ui/toaster";
import { getQueryClient } from "@/lib/query";
import { getAllProducts } from "@/actions/getAllProducts";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AccessDeniedToast } from "@/components/AccessDeniedToast";
import { FloatingChatWrapper } from "@/components/ChatBot/FloatingChatWrapper";

const inter = Inter({
  subsets: ["latin"],
<<<<<<< HEAD
  display: "swap", // Add this line
=======
  display: "swap",
>>>>>>> c7456e30d59a0fad7d0f7350d16cefeab6a69db7
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
          </HydrationBoundary>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
