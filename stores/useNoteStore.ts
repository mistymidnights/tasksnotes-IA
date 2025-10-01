import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabaseClient";
import { addToast } from "@heroui/toast";

// ----------------- TIPOS DE DATOS -----------------

export interface Note {
  id?: string;
  user_id: string;
  title: string;
  description: string;
  created_at?: string | undefined;
  updated_at?: string;
}

interface NoteState {
  notes: Note[];
  loading: boolean;
  fetchNotes: (userId: string) => Promise<void>;
  addNoteLocally: (newNote: Note) => void;
  updateNoteLocally: (noteId: string, updates: Partial<Note>) => void;
  deleteNoteLocally: (noteId: string) => void;
  createNote: (
    note: Omit<Note, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  saveNote: (note: Note) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  clearNotes: () => void;
}

// ----------------- LA STORE -----------------

export const useNoteStore = create(
  persist<NoteState>(
    (set, get) => ({
      notes: [],
      loading: true,

      // --- GET ---
      fetchNotes: async (userId) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase
            .from("notes")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

          if (error) {
            addToast({
              title: "Error obteniendo notas",
              color: "danger",
            });
            console.error("Error fetching notes:", error);
            set({ notes: [], loading: false });
          } else {
            set({ notes: data as Note[], loading: false });
          }
        } catch (error) {
          console.error("Error in fetchNotes:", error);
          set({ notes: [], loading: false });
        }
      },

      // --- CLEAR ---

      clearNotes: () => set({ notes: [], loading: false }),

      // --- LOCAL UPDATES ---
      addNoteLocally: (newNote) => {
        set((state) => ({
          notes: [newNote, ...state.notes],
        }));
      },

      updateNoteLocally: (noteId, updates) => {
        set((state) => ({
          notes: state.notes.map((note) => {
            if (note.id === noteId) {
              return { ...note, ...updates };
            }
            return note;
          }),
        }));
      },

      deleteNoteLocally: (noteId) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== noteId),
        }));
      },

      // --- CREATE / insert ---

      createNote: async (newNoteData) => {
        try {
          const { data, error } = await supabase
            .from("notes")
            .insert(newNoteData)
            .select()
            .single();

          if (error) throw error;

          get().addNoteLocally(data as Note);

          addToast({
            title: "Nota creada",
            description: "Tu nueva nota ha sido guardada.",
            color: "success",
          });
        } catch (error) {
          addToast({
            title: "Error al crear nota",
            description: "No se pudo sincronizar la nota con la base de datos.",
            color: "danger",
          });
          console.error("Fallo la acción de crear nota:", error);
        }
      },

      // --- UPDATE / upsert ---

      saveNote: async (note) => {
        try {
          const { error } = await supabase
            .from("notes")
            .upsert(
              { ...note, updated_at: new Date().toISOString() },
              { onConflict: "id" }
            );

          if (error) {
            addToast({
              title: "Error al guardar nota",
              description:
                "No se pudo sincronizar la nota con la base de datos.",
              color: "danger",
            });
            console.error("Error Supabase al guardar nota:", error);
            throw new Error(error.message);
          }

          if (note.id) {
            get().updateNoteLocally(note.id, note);
          }
        } catch (error) {
          console.error("Fallo la acción de guardar nota:", error);
        }
      },

      // --- DELETE ---
      deleteNote: async (noteId) => {
        const noteToDelete = get().notes.find((n) => n.id === noteId);
        if (!noteToDelete) return;

        get().deleteNoteLocally(noteId);

        try {
          const { error } = await supabase
            .from("notes")
            .delete()
            .eq("id", noteId);

          if (error) {
            addToast({
              title: "Error al eliminar nota",
              description: "La nota se restauró localmente.",
              color: "danger",
            });
            console.error("Error Supabase al eliminar:", error);
            get().addNoteLocally(noteToDelete);
            throw new Error(error.message);
          }

          addToast({
            title: "Nota eliminada",
            description: "La nota ha sido eliminada.",
            color: "success",
          });
        } catch (error) {
          console.error("Fallo la eliminación de nota:", error);
        }
      },
    }),

    {
      name: "note-storage",
    }
  )
);
