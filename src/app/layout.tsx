import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/Providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MBtek Sales Manager",
  description: "Sales Manager for MBtek",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex w-full items-center justify-center">
            <Navbar />
          </div>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
