"use client";

import NoteCreate from "@/components/Notes/NoteCreate";
import NoteEditor from "@/components/Notes/NoteEditor";
import NotesList from "@/components/Notes/NotesList";
import Tasks from "@/components/Tasks/Tasks";
import { Note } from "@/stores/useNoteStore";
import { Button } from "@heroui/react";
import { useState } from "react";
import { MdAddBox } from "react-icons/md";

export default function Dashboard() {
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const handleNoteSelect = (note: Note) => {
    setEditingNote(note);
    setIsCreating(false);
  };

  // --- CREAR NOTA ---
  const handleEditExit = () => {
    setEditingNote(null);
    setIsCreating(false);
  };

  // --- CREAR NOTA ---
  const handleCreateNote = () => {
    setEditingNote(null);
    setIsCreating(true);
  };

  const showEditor = editingNote || isCreating;

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-2">
      <div className="bg-white w-full lg:w-2/3 p-6 rounded-lg relative">
        <p className="text-black text-3xl lg:text-5xl font-bold">Notas</p>
        {isCreating ? (
          <NoteCreate onClose={handleEditExit} />
        ) : editingNote ? (
          <NoteEditor note={editingNote} onClose={handleEditExit} />
        ) : (
          <NotesList onNoteSelect={handleNoteSelect} />
        )}
        <Button
          isIconOnly
          className={`${showEditor === editingNote || isCreating ? "hidden" : "absolute top-4 right-4 "}`}
          color="primary"
          size="lg"
          variant="light"
          title="Agregar Nota"
          onPress={handleCreateNote}
        >
          <MdAddBox size={26} />
        </Button>
      </div>
      <div className="bg-[#a677bf] w-full lg:w-1/3 p-6 rounded-lg">
        <Tasks />
      </div>
    </div>
  );
}
