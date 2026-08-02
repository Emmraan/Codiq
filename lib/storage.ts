/**
 * Storage abstraction.
 *
 * Progress is stored in IndexedDB (via `idb`) with a transparent fallback to
 * `localStorage` when IndexedDB is unavailable (private mode, restricted
 * iframes, older engines). Stores never touch the browser APIs directly —
 * they call `storage.getJSON` / `storage.setJSON`.
 *
 * See docs/STATE_AND_DATA.md for the full persistence strategy.
 */

import { openDB, type DBSchema, type IDBPDatabase } from "idb";

import { STORAGE_DB, STORAGE_STORE } from "@/lib/constants";

interface KVStore extends DBSchema {
  [STORAGE_STORE]: {
    key: string;
    value: unknown;
  };
}

export interface StorageAdapter {
  getItem(key: string): Promise<unknown | undefined>;
  setItem(key: string, value: unknown): Promise<void>;
  removeItem(key: string): Promise<void>;
}

function isIndexedDBAvailable(): boolean {
  try {
    return typeof indexedDB !== "undefined";
  } catch {
    return false;
  }
}

let dbPromise: Promise<IDBPDatabase<KVStore>> | undefined;

function getDB(): Promise<IDBPDatabase<KVStore>> {
  dbPromise ??= openDB<KVStore>(STORAGE_DB, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORAGE_STORE)) {
        db.createObjectStore(STORAGE_STORE);
      }
    },
  });
  return dbPromise;
}

const idbAdapter: StorageAdapter = {
  async getItem(key) {
    const db = await getDB();
    return db.get(STORAGE_STORE, key);
  },
  async setItem(key, value) {
    const db = await getDB();
    await db.put(STORAGE_STORE, value, key);
  },
  async removeItem(key) {
    const db = await getDB();
    await db.delete(STORAGE_STORE, key);
  },
};

const localStorageAdapter: StorageAdapter = {
  getItem(key) {
    const raw = localStorage.getItem(key);
    return Promise.resolve(raw === null ? undefined : JSON.parse(raw));
  },
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    return Promise.resolve();
  },
  removeItem(key) {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

/** The active adapter. Falls back to localStorage when IndexedDB is missing. */
export const storage: StorageAdapter = isIndexedDBAvailable() ? idbAdapter : localStorageAdapter;

/** Convenience helpers for JSON (de)serialization. */
export const storageJson = {
  async get<T>(key: string, fallback: T): Promise<T> {
    const value = await storage.getItem(key);
    return (value as T) ?? fallback;
  },
  async set<T>(key: string, value: T): Promise<void> {
    await storage.setItem(key, value);
  },
  async remove(key: string): Promise<void> {
    await storage.removeItem(key);
  },
};
