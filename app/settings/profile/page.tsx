"use client";

import { DateInput } from "@heroui/date-input";
import { useUserStore } from "@/stores/useStore";
import { Input } from "@heroui/input";
import { Image } from "@heroui/image";
import { useState, useEffect } from "react";
import { parseDate } from "@internationalized/date";
import { Button, Form } from "@heroui/react";
import { useAuth } from "@/hooks/useAuth";
import { DEFAULT_AVATAR } from "@/utils/avatarOptions";
import AvatarSelector from "@/components/AvatarSelector";
type DateValue = any;

export default function Profile() {
  const { user } = useAuth();
  const { profile, clearProfile, fetchProfile, updateProfile } = useUserStore();
  const [localFullName, setLocalFullName] = useState<string>("");
  const [localDateOfBirth, setLocalDateOfBirth] = useState<DateValue | null>(
    null
  );
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    } else {
      clearProfile();
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    if (profile) {
      setLocalFullName(profile.full_name || "");
      if (profile.date_of_birth) {
        try {
          const parsedDate = parseDate(profile.date_of_birth);
          setLocalDateOfBirth(parsedDate);
        } catch (error) {
          console.error("Error parsing date:", error);
          setLocalDateOfBirth(null);
        }
      }
    }
  }, [profile]);

  useEffect(() => {
    console.log("El perfil ha sido actualizado:", profile);
  }, [profile]);

  const handleDateChange = (newDate: DateValue | null) => {
    if (newDate) {
      const dateObject = newDate.toDate("UTC");

      const formattedDate = dateObject.toISOString().split("T")[0];

      updateProfile({ date_of_birth: formattedDate });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updates = {
      full_name: localFullName,
      date_of_birth: localDateOfBirth
        ? localDateOfBirth.toDate("UTC").toISOString().split("T")[0]
        : null,
      avatar_url: localAvatarUrl,
    };

    updateProfile(updates);
  };

  return (
    <div className="h-auto flex flex-col items-center justify-center gap-4">
      <Form className="w-full max-w-2xl" onSubmit={handleSubmit}>
        <Input
          label="Nombre de usuario"
          value={profile?.username?.toString() || ""}
          type="text"
          description="Este valor no puede ser cambiado"
          isReadOnly
          isDisabled
        />
        <Input
          label="Nombre completo"
          value={localFullName}
          onChange={(e) => setLocalFullName(e.target.value)}
          type="text"
        />
        <DateInput
          id="date-input"
          label={"Año de nacimiento"}
          value={localDateOfBirth}
          onChange={setLocalDateOfBirth}
        />
        <div className="flex flex-col items-center my-6">
          <Image
            alt="Profile image"
            src={profile?.avatar_url || DEFAULT_AVATAR}
            width={192}
            height={192}
            className="rounded-full w-48 h-48 object-cover border-4 border-blue-500 shadow-lg"
          />
        </div>

        <AvatarSelector
          currentAvatarUrl={localAvatarUrl}
          onSelectAvatar={setLocalAvatarUrl}
        />
        <Button
          type="submit"
          variant="solid"
          color="primary"
          className="mt-2
          mb-12"
          size="lg"
        >
          Guardar
        </Button>
      </Form>
    </div>
  );
}
