"use client";

import { create } from "zustand";

interface AppState {
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  pageTitle: "",
  setPageTitle: (title: string) => set({ pageTitle: title }),
}));
