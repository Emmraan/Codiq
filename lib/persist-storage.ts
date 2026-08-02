import { createJSONStorage, type StateStorage } from "zustand/middleware";

import { storage, storageJson } from "@/lib/storage";

/**
 * Zustand persist storage backed by the app's storage abstraction
 * (IndexedDB with localStorage fallback). Use this in `persist()` options so
 * every persisted store survives reloads and private browsing.
 */
export const asyncStateStorage: StateStorage = {
  getItem: async (name) => {
    const value = await storage.getItem(name);
    return value === undefined ? null : JSON.stringify(value);
  },
  setItem: async (name, value) => {
    await storage.setItem(name, JSON.parse(value));
  },
  removeItem: async (name) => {
    await storage.removeItem(name);
  },
};

/** Convenience for JSON-persisted stores. */
export const createAsyncJSONStorage = () => createJSONStorage(() => asyncStateStorage);

export { storageJson };
