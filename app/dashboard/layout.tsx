"use client";

import AuthGuard from "@/components/AuthGuard";
import SetTitle from "@/components/SetTitle";
import { Image } from "@heroui/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SetTitle title="" />
      <main>{children}</main>
    </AuthGuard>
  );
}
