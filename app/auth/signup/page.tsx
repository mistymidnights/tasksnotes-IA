"use client";

import { useState } from "react";
import { Input, Button, Card, DatePicker } from "@heroui/react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import { parseDate } from "@internationalized/date";
import { Image } from "@heroui/image";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const router = useRouter();

  const validateAge = (date: Date | null): boolean => {
    if (!date) return true;

    const today = new Date();
    const minAgeDate = new Date();
    minAgeDate.setFullYear(today.getFullYear() - 14);

    return date <= minAgeDate;
  };

  const handleSignup = async () => {
    setError(null);
    setSuccess("");
    setLoading(true);

    try {
      // 1. Registrar usuario en authentication
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      // 2. Crear perfil en la tabla profiles
      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          username: username.trim(),
          full_name: fullName.trim(),
          date_of_birth: dateOfBirth,
        });

        if (profileError) {
          setError(`Error creando perfil: ${profileError.message}`);
          return;
        }

        if (dateOfBirth && !validateAge(dateOfBirth)) {
          setError("Debes tener al menos 13 años para registrarte");
          return;
        }

        setSuccess("¡Cuenta creada! Redirigiendo al dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (err) {
      setError("Error inesperado al crear cuenta");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.push("/auth/login");
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
      <Card className="p-6 w-full max-w-md shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Crear cuenta</h1>
        <div className="space-y-4">
          <Input
            label="Nombre de usuario"
            placeholder="Elige un nombre de usuario único"
            isRequired
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            description="Este será tu nombre público en la aplicación"
          />

          <Input
            label="Nombre completo"
            placeholder="Tu nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <DatePicker
            label="Fecha de nacimiento"
            firstDayOfWeek={"mon"}
            isRequired
            value={
              dateOfBirth
                ? parseDate(dateOfBirth.toISOString().split("T")[0])
                : null
            }
            onChange={(value) => {
              if (value) {
                const jsDate = new Date(
                  value.year,
                  value.month - 1,
                  value.day + 1
                );
                setDateOfBirth(jsDate);
              } else {
                setDateOfBirth(null);
              }
            }}
            showMonthAndYearPickers
            className="w-full"
          />
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
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-solid outline-transparent"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
          />

          <Button
            color="primary"
            fullWidth
            onClick={handleSignup}
            isLoading={loading}
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>

          <Button
            color="secondary"
            fullWidth
            onClick={goToLogin}
            className="text-black font-medium"
          >
            Volver a login
          </Button>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
              {success}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
