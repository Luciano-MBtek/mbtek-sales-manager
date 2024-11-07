import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/Providers";
import { Toaster } from "@/components/ui/toaster";
import { getQueryClient } from "@/lib/query";
import { getAllProducts } from "@/actions/getAllProducts";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

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
          <div className="flex w-full items-center justify-center">
            <Navbar />
          </div>
          <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
          </HydrationBoundary>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
