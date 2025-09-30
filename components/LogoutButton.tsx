"use client";

import { Button } from "@heroui/react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error al cerrar sesión:", error);
        return;
      }

      router.push("/auth/login");
    } catch (error) {
      console.error("Error inesperado:", error);
    }
  };

  return (
    <Button color="danger" onPress={handleLogout}>
      Cerrar Sesión
    </Button>
  );
}
