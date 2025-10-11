"use client";

import { usePathname } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";
import React from "react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const EXCLUDED_PATHS = ["/auth/login", "/auth/signup", "/auth/onboarding"];

  const isAuthRoute = EXCLUDED_PATHS.some((path) => pathname.startsWith(path));

  if (isAuthRoute) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  return (
    <AuthGuard>
      <div className="relative flex flex-col">
        <Header />
        <main className="container mx-auto px-6 flex-grow">{children}</main>
      </div>
    </AuthGuard>
  );
}
