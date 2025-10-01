import { useNotes } from "@/hooks/useNotes";
import React from "react";
import NoteCard from "../NoteCard";
import { Note } from "@/stores/useNoteStore";

interface NotesListProps {
  onNoteSelect: (note: Note) => void;
}

const NotesList = ({ onNoteSelect }: NotesListProps) => {
  const { notes, loading: loadingFetch } = useNotes();
  console.log("NotesList notes:", notes);

  return (
    <div className="py-8">
      {loadingFetch && <p>Loading notes...</p>}
      {!loadingFetch && notes.length === 0 && <p>No notes available.</p>}
      {notes.length !== 0 && (
        <div>
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => onNoteSelect(note)}
              className="flex flex-col gap-4 mb-2 cursor-pointer"
            >
              <NoteCard
                id={note.id}
                title={note.title}
                date={
                  note.created_at
                    ? new Date(note.created_at).toLocaleDateString()
                    : "Unknown date"
                }
                isCentered={false}
                children={note.description}
                maxTextLength={100}
                onSelect={() => onNoteSelect(note)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;
