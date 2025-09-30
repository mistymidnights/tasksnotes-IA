import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import React from "react";
import AuthGuard from "@/components/AuthGuard";
import SetTitle from "@/components/SetTitle";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SetTitle title="Configuración de perfil" />
      <div className="sm:px-6 lg:px- py-4 text-white">
        <Link href={"/dashboard"} className="inline-flex gap-4 items-center">
          <IoIosArrowBack size={24} />
          Ir atrás
        </Link>
      </div>

      <div>{children}</div>
    </AuthGuard>
  );
}
