import { useNotes } from "@/hooks/useNotes";
import { Note, useNoteStore } from "@/stores/useNoteStore";
import { addToast, Button, Input, Textarea } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Form } from "@heroui/form";
import { useAuth } from "@/hooks/useAuth";

interface NoteCreateProps {
  onClose: () => void;
}
const NoteCreate = ({ onClose }: NoteCreateProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const createNote = useNoteStore((state) => state.createNote);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      addToast({
        title: "Error",
        description: "Debes iniciar sesión.",
        color: "danger",
      });
      return;
    }

    if (!title.trim() || !description.trim()) {
      addToast({
        title: "Error",
        description: "Ambos campos son requeridos.",
        color: "danger",
      });
      return;
    }

    setLoading(true);

    try {
      const newNoteData = {
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
      };

      await createNote(newNoteData);

      onClose();
    } catch (error) {
      addToast({
        title: "Error",
        description: "Fallo al crear la nota. Intenta de nuevo.",
        color: "danger",
      });
      console.error("Fallo la creación de nota:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      data-theme="light"
      className="w-full text-black py-8"
      onSubmit={handleSubmit}
    >
      <Input
        value={title}
        label="Titulo de la nota"
        labelPlacement="inside"
        name="Titulo de la nota"
        type="text"
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        value={description}
        label="Descripcion"
        labelPlacement="inside"
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <Button type="button" onPress={onClose} variant="flat" color="danger">
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="solid"
          color="primary"
          isLoading={loading}
        >
          Crear Nota
        </Button>
      </div>
    </Form>
  );
};

export default NoteCreate;
