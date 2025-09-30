import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import AuthGuard from "@/components/AuthGuard";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground font-sans antialiased bg-black",
          fontSans.variable
        )}
      >
        <Providers>
          <AuthGuard>
            <div className="relative flex flex-col">
              <main className="container mx-auto px-6 pb-12 sm:pb-4 flex-grow">
                <Header />
                {children}
              </main>
            </div>
          </AuthGuard>
          <Toaster
            position="top-center"
            containerStyle={{}}
            toasterId="default"
            toastOptions={{
              style: {
                background: "#363636",
                color: "#fff",
              },
              duration: 5000,
              success: {
                style: {
                  background: "#54df7d",
                  color: "#000000",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
