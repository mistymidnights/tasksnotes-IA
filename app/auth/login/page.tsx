"use client";

import { useState } from "react";
import { Input, Button, Card } from "@heroui/react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import { Image } from "@heroui/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user && data.session) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Error inesperado al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const goToSignUp = () => {
    router.push("/auth/signup");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <Image
        width={400}
        src={"/images/LogoNebulosa.png"}
        alt={"Nebulosa Notes"}
        className="py-6"
        loading="lazy"
      />
      <Card className="p-6 w-full max-w-sm shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h1>
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="Escribe tu email"
            isRequired
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Contraseña"
            type={isVisible ? "text" : "password"}
            isRequired
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400" />
                )}
              </button>
            }
          />

          <Button
            color="primary"
            fullWidth
            onPress={handleLogin}
            className="font-bold"
            isLoading={loading}
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Entrar"}
          </Button>

          <Button
            color="secondary"
            className="text-black"
            fullWidth
            onPress={goToSignUp}
          >
            Crear cuenta
          </Button>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
