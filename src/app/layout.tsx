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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MBtek Sales Manager",
  description: "Sales Manager for MBtek",
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
            <AppSidebar />
            <main className="flex w-full ">
              <SidebarTrigger />
              {children}
            </main>
          </HydrationBoundary>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
