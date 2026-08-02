/** Shared constant keys used across stores and storage adapters. */

export const STORAGE_KEYS = {
  progress: "codiq:progress:v1",
  settings: "codiq:settings:v1",
  activity: "codiq:activity:v1",
} as const;

export const STORAGE_DB = "codiq";
export const STORAGE_STORE = "kv";
