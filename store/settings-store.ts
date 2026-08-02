"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createAsyncJSONStorage } from "@/lib/persist-storage";
import { STORAGE_KEYS } from "@/lib/constants";

export type Theme = "dark" | "light";
export type EditorTheme = "vs-dark" | "vs" | "hc-black";

export interface SettingsState {
  theme: Theme;
  editorFontSize: number;
  editorTheme: EditorTheme;
  animationsEnabled: boolean;
  setTheme: (theme: Theme) => void;
  setEditorFontSize: (size: number) => void;
  setEditorTheme: (theme: EditorTheme) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
  theme: "dark" as const,
  editorFontSize: 14,
  editorTheme: "vs-dark" as const,
  animationsEnabled: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setTheme: (theme) => set({ theme }),
      setEditorFontSize: (editorFontSize) => set({ editorFontSize }),
      setEditorTheme: (editorTheme) => set({ editorTheme }),
      setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
      resetSettings: () => set({ ...DEFAULT_SETTINGS }),
    }),
    {
      name: STORAGE_KEYS.settings,
      storage: createAsyncJSONStorage(),
    },
  ),
);

export { DEFAULT_SETTINGS };
