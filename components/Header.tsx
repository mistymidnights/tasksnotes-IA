"use client";

import { CiLogout } from "react-icons/ci";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/stores/useStore";
import { Button } from "@heroui/button";
import { User, AvatarIcon } from "@heroui/react";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/stores/appStore";
import { Image } from "@heroui/image";
import { useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { profile, clearProfile, fetchProfile } = useUserStore();
  const { pageTitle } = useAppStore();

  const EXCLUDED_PATHS = ["/auth/login", "/auth/signup", "/auth/onboarding"];
  const isExcludedPath = EXCLUDED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  useEffect(() => {
    if (user && !isExcludedPath) {
      fetchProfile(user.id);
    } else {
      clearProfile();
    }
  }, [user, fetchProfile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setTimeout(() => {
      toast.success("Sesión cerrada correctamente.");
      router.push("/auth/login");
    });
  };

  return (
    <>
      {user && profile ? (
        <header>
          <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <Link href={"/dashboard"}>
                {pathname === "/dashboard" ? (
                  <>
                    <div className="hidden sm:block w-[250px] md:w-[350px] mx-auto flex-shrink-0">
                      <Image
                        width={350}
                        src={"/images/LogoNebulosa.png"}
                        alt={"Nebulosa Notes"}
                        loading="eager"
                      />
                    </div>
                    <div className="block sm:hidden w-[50px] flex-shrink-0">
                      <Image
                        width={72}
                        src={"/images/LogoNebulosa1.png"}
                        alt={"Nebulosa Notes"}
                        loading="lazy"
                      />
                    </div>
                  </>
                ) : (
                  <div className="w-[50px] flex-shrink-0">
                    <Image
                      width={72}
                      src={"/images/LogoNebulosa1.png"}
                      alt={"Nebulosa Notes"}
                      loading="lazy"
                    />
                  </div>
                )}
              </Link>
              <h1 className="text-lg lg:text-5xl font-bold text-white">
                {pageTitle}
              </h1>
            </div>
            <div className="flex gap-2 sm:gap-4 items-center bg-transparent p-4 rounded-2xl">
              <Link href={"/settings/profile"}>
                <User
                  classNames={{
                    name: "text-white hidden sm:block",
                    description: "hidden sm:block",
                  }}
                  avatarProps={{
                    src: profile?.avatar_url || undefined,
                    icon: !profile?.avatar_url ? <AvatarIcon /> : undefined,
                    classNames: !profile?.avatar_url
                      ? {
                          base: "bg-linear-to-br from-[#FFB457] to-[#FF705B] ",
                          icon: "text-black/80",
                        }
                      : { base: "m-0 sm:m-2" },
                    isBordered: true,
                    color: "success",
                  }}
                  description={user?.email}
                  name={profile?.full_name}
                />
              </Link>
              <Button
                isIconOnly
                color="secondary"
                onPress={handleLogout}
                size="lg"
                title="Cerrar sesión"
              >
                <CiLogout size={20} className="text-black" />
              </Button>
            </div>
          </div>
        </header>
      ) : null}
    </>
  );
}
