import { useEffect } from "react";
import { useNoteStore, useUserStore } from "@/stores/useStore";

export function useNotes() {
  const userId = useUserStore((state) => state.profile?.id);
  const { notes, loading, fetchNotes } = useNoteStore();

  useEffect(() => {
    if (userId) {
      fetchNotes(userId);
    } else {
      useNoteStore.getState().clearNotes();
    }
  }, [userId, fetchNotes]);

  return { notes, loading };
}
