"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!loading) {
        setIsChecking(false);

        if (!user && pathname?.startsWith("/dashboard")) {
          console.log("🔐 No autenticado, redirigiendo a login...");
          router.push("/auth/login");
          return;
        }

        if (
          user &&
          (pathname?.startsWith("/auth/login") ||
            pathname?.startsWith("/auth/signup"))
        ) {
          console.log("🔄 Ya autenticado, redirigiendo a dashboard...");
          router.push("/dashboard");
          return;
        }
      }
    };

    checkAuth();
  }, [user, loading, router, pathname]);

  if (loading || isChecking) {
    return <LoadingSpinner />;
  }

  if (!user && pathname?.startsWith("/dashboard")) {
    return <LoadingSpinner />;
  }

  if (
    user &&
    (pathname?.startsWith("/auth/login") ||
      pathname?.startsWith("/auth/signup"))
  ) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
