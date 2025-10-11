import { create } from "zustand";

interface SelectionLanguage {
  selectedLanguage: string;
  setSelectedLanguage: (text: string) => void;
  clearSelectionLanguage: () => void;
}

export const useLanguageStore = create<SelectionLanguage>((set) => ({
  selectedLanguage: "",
  setSelectedLanguage: (text) => set({ selectedLanguage: text }),
  clearSelectionLanguage: () => set({ selectedLanguage: "" }),
}));
