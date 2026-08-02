"use client";

import { create } from "zustand";

/** Ephemeral UI state — intentionally not persisted. */
export interface UIState {
  commandPaletteOpen: boolean;
  mobileNavOpen: boolean;
  /** Lesson sidebar on wide screens (Phase 2+). */
  sidebarOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setMobileNavOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  commandPaletteOpen: false,
  mobileNavOpen: false,
  sidebarOpen: true,
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
