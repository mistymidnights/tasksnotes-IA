"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Input, Button, Card, DatePicker } from "@heroui/react";
import { DateValue } from "@react-aria/calendar";

export default function OnboardingPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirthValue, setDateOfBirthValue] = useState<DateValue | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
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

  // 1. Verificar sesión y perfil
  useEffect(() => {
    const checkUserAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUser(user);

      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (user && profile) {
        router.push("/dashboard");
        return;
      }

      // 3. Perfil NO existe (nuevo registro OAuth), pre-rellenar formulario
      const metadata = user.user_metadata || {};
      const nameFromGoogle = metadata.full_name || "";
      const emailUsername = metadata.email ? metadata.email.split("@")[0] : "";

      setFullName(nameFromGoogle);
      setUsername(emailUsername.replace(/[^a-zA-Z0-9]/g, ""));
      setLoading(false);
    };

    checkUserAndProfile();
  }, [router]);

  // 4. Lógica para completar y guardar el perfil
  const handleCompleteProfile = async () => {
    setError(null);
    if (!user) return;
    setLoading(true);

    const dateOfBirthString = getDateString(dateOfBirthValue);
    const dateOfBirthForValidation = new Date(dateOfBirthString + "T00:00:00");

    if (!dateOfBirthString || !username) {
      setError(
        "El Nombre de usuario y la Fecha de nacimiento son obligatorios."
      );
      setLoading(false);
      return;
    }

    const validateAge = (date: Date | null): boolean => {
      if (!date || isNaN(date.getTime())) return false;
      const today = new Date();
      const minAgeDate = new Date();
      minAgeDate.setFullYear(today.getFullYear() - 13);
      return date <= minAgeDate;
    };

    if (!validateAge(dateOfBirthForValidation)) {
      setError("Debes ser mayor de 13 años para registrarte.");
      setLoading(false);
      return;
    }

    try {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        username: username.trim(),
        full_name: fullName.trim(),
        date_of_birth: dateOfBirthString,
        avatar_url: "/images/avatars/mono.png",
      });

      if (profileError) {
        console.error("Error creando perfil:", profileError);
        setError(
          `Error creando perfil: ${profileError.message}. Intenta con otro nombre de usuario.`
        );
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Error inesperado al completar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Cargando sesión...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <Card className="p-6 w-full max-w-md shadow-xl bg-neutral-900 border border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-center text-white">
          ¡Casi listo! Completa tu perfil
        </h1>
        <p className="text-sm text-gray-400 mb-6 text-center">
          Necesitamos un par de datos para terminar tu registro.
        </p>
        <div className="space-y-4">
          <Input
            label="Nombre completo"
            placeholder="Tu nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled
          />

          <Input
            label="Nombre de usuario"
            placeholder="Elige un nombre único"
            isRequired
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            description="Este será tu nombre público en la aplicación"
          />

          <DatePicker
            label="Fecha de nacimiento"
            firstDayOfWeek={"mon"}
            isRequired
            value={dateOfBirthValue}
            onChange={setDateOfBirthValue}
            showMonthAndYearPickers
            className="w-full"
          />

          <Button
            color="primary"
            fullWidth
            onClick={handleCompleteProfile}
            isLoading={loading}
            disabled={loading}
          >
            Completar registro
          </Button>

          {error && (
            <div className="bg-red-900 border border-red-400 text-red-300 px-4 py-2 text-sm mt-4 rounded-2xl">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
