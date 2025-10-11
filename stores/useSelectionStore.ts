import { create } from "zustand";

interface SelectionState {
  selectedText: string;
  setSelectedText: (text: string) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedText: "",
  setSelectedText: (text) => set({ selectedText: text }),
  clearSelection: () => set({ selectedText: "" }),
}));
