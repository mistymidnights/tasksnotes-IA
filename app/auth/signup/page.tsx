"use client";

import { useState } from "react";
import { Input, Button, Card, DatePicker } from "@heroui/react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import { parseDate } from "@internationalized/date";
import { Image } from "@heroui/image";
import { DateValue } from "@react-aria/calendar"; // Importación necesaria

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");

  const [dateOfBirthValue, setDateOfBirthValue] = useState<DateValue | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const router = useRouter();

  const getDateString = (value: DateValue | null): string | null => {
    if (!value) return null;

    const year = value.year;
    const month = value.month;
    const day = value.day;

    const paddedMonth = String(month).padStart(2, "0");
    const paddedDay = String(day).padStart(2, "0");

    return `${year}-${paddedMonth}-${paddedDay}`;
  };

  const getDateForValidation = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    return new Date(dateString + "T00:00:00");
  };

  const validateAge = (date: Date | null): boolean => {
    if (!date || isNaN(date.getTime())) return false;

    const today = new Date();
    const minAgeDate = new Date();
    minAgeDate.setFullYear(today.getFullYear() - 13);

    return date <= minAgeDate;
  };

  // -----------------------------------------------------
  // Lógica de Registro con Email y Contraseña
  // -----------------------------------------------------
  const handleSignup = async () => {
    setError(null);
    setSuccess("");
    setLoading(true);

    const dateOfBirthString = getDateString(dateOfBirthValue);
    const dateForValidation = getDateForValidation(dateOfBirthString);

    if (!dateOfBirthString || !validateAge(dateForValidation)) {
      setError(
        "Debes ser mayor de 13 años para registrarte y proporcionar una fecha válida."
      );
      setLoading(false);
      return;
    }

    if (!email || !password || !username) {
      setError(
        "Por favor, completa los campos de Email, Contraseña y Nombre de usuario."
      );
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          username: username.trim(),
          full_name: fullName.trim(),
          date_of_birth: dateOfBirthString,
        });

        if (profileError) {
          console.error("Error creando perfil:", profileError);
          setError(
            `Error creando perfil: ${profileError.message}. Por favor, contacta a soporte.`
          );
          return;
        }

        setSuccess("¡Cuenta creada! Redirigiendo al dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setSuccess(
          "¡Registro exitoso! Por favor, revisa tu email para confirmar tu cuenta y completar el proceso."
        );
      }
    } catch (err) {
      setError("Error inesperado al crear cuenta");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------
  // Lógica de Registro con Google OAuth (Sin Cambios)
  // -----------------------------------------------------
  const signInWithGoogle = async () => {
    setError(null);
    setSuccess("");
    setLoading(true);

    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";

    const redirectTo = `${origin}/auth/onboarding`;

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo,
          scopes: "email profile",
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.url) {
        router.push(data.url);
      }
    } catch (err) {
      setError("Error inesperado al registrarse con Google");
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.push("/auth/login");
  };

  const handleDateChange = (value: DateValue | null) => {
    setDateOfBirthValue(value);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-black p-4">
      <Image
        width={400}
        src={"/images/LogoNebulosa.png"}
        alt={"Nebulosa Notes"}
        className="py-6 max-w-full h-auto"
        loading="lazy"
      />
      <Card className="p-6 w-full max-w-md shadow-xl bg-neutral-900 border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          Crear cuenta
        </h1>
        <div className="space-y-4">
          <Button
            fullWidth
            color="default"
            variant="bordered"
            onPress={signInWithGoogle}
            className="font-bold flex items-center justify-center gap-2 border-gray-600 text-white hover:bg-gray-800"
            isLoading={loading && email === ""} // Muestra loading solo si no hay campos llenos (asumiendo OAuth)
            disabled={loading}
          >
            {/* Ícono de Google (SVG con estilo más moderno) */}
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-5 h-5"
            >
              <path
                fill="#EA4335"
                d="M24 10.5c3.54 0 6.71 1.22 9.21 3.6l6.83-6.83C35.83 2.92 30.09 0 24 0 14.83 0 6.5 4.09 1 10.5l8.52 6.5C11.66 12.02 17.55 10.5 24 10.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24.5c0-1.56-.13-3.09-.36-4.6H24v8.8h12.42c-.61 3.09-2.34 5.74-4.94 7.54l6.83 5.28C43.68 36.71 46.98 30.73 46.98 24.5z"
              ></path>
              <path
                fill="#FBBC05"
                d="M10.5 28.5c-.75-2.2-1.2-4.52-1.2-7 0-2.48.45-4.8 1.2-7L1.98 10.5C.72 13.51 0 17.06 0 21.5s.72 7.99 1.98 10.99l8.52-6.5z"
              ></path>
              <path
                fill="#34A853"
                d="M24 47.79c6.43 0 11.95-2.13 15.96-5.87l-6.83-5.28c-2.83 2.07-6.52 3.32-9.13 3.32-5.75 0-10.68-3.56-12.78-8.54l-8.52 6.5C6.5 43.6 14.83 47.79 24 47.79z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Registrarse con Google
          </Button>

          {/* Separador visual */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="text-gray-400 text-sm">
              O regístrate con Email
            </span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

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
            value={dateOfBirthValue}
            onChange={handleDateChange}
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
            isLoading={loading && email !== ""}
            disabled={loading}
          >
            {loading && email !== "" ? "Creando cuenta..." : "Crear cuenta"}
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
            <div className="bg-red-900 border border-red-400 text-red-300 px-4 py-2 rounded text-sm mt-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          {success && (
            <div className="bg-green-800 border border-green-400 text-green-200 px-4 py-2 rounded text-sm mt-4">
              {success}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
