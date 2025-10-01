import { useNotes } from "@/hooks/useNotes";
import { Note, useNoteStore } from "@/stores/useNoteStore";
import { addToast, Button, Input, Textarea } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Form } from "@heroui/form";

interface NoteEditorProps {
  note: Note;
  onClose: () => void;
}
const NoteEditor = ({ note, onClose }: NoteEditorProps) => {
  const { notes, loading: loadingFetch } = useNotes();
  console.log("NotesList notes:", notes);

  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);
  const saveNote = useNoteStore((state) => state.saveNote);

  useEffect(() => {
    setTitle(note.title);
    setDescription(note.description);
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedNote: Note = {
      ...note,
      title,
      description,
    };

    try {
      await saveNote(updatedNote);
      onClose();
    } catch (error) {
      addToast({
        title: "error",
        description:
          "No se ha podido guardar la nota. Porfavor, intentelo de nuevo.",
      });
      console.error("Failed to save note from form:", error);
    }
  };

  return (
    <Form className="w-full text-black py-8" onSubmit={handleSubmit}>
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
        <Button type="submit" variant="solid" color="primary">
          Guardar
        </Button>
      </div>
    </Form>
  );
};

export default NoteEditor;
