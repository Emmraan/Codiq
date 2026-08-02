"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createAsyncJSONStorage } from "@/lib/persist-storage";
import { STORAGE_KEYS } from "@/lib/constants";
import type { ProgressEvent, ProgressEventType, ProgressState } from "@/types/progress";

const DEFAULT_PROGRESS: ProgressState = {
  completedLessons: [],
  completedLabs: [],
  totalXp: 0,
  lastActivity: 0,
  streak: { current: 0, best: 0 },
  resume: {},
  badges: [],
  achievements: [],
  activity: [],
};

let eventId = 0;

export interface ProgressStore extends ProgressState {
  hydrated: boolean;
  /** Load persisted state into memory. Safe to call more than once. */
  hydrate: () => Promise<void>;
  startLesson: (lessonSlug: string) => void;
  setCurrentPath: (pathSlug: string) => void;
  completeLesson: (lessonSlug: string, xp: number) => void;
  completeLab: (labId: string, xp: number) => void;
  setResumePosition: (lessonSlug: string, scrollPosition: number) => void;
  /** Raw XP award + event log; gamification services build on this (Phase 5/6). */
  awardXp: (amount: number, type: ProgressEventType, message: string, lessonSlug?: string) => void;
  addEvent: (event: Omit<ProgressEvent, "id" | "at">) => void;
  resetProgress: () => void;
}

function makeEvent(event: Omit<ProgressEvent, "id" | "at">): ProgressEvent {
  eventId += 1;
  return { ...event, id: `evt-${Date.now()}-${eventId}`, at: Date.now() };
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_PROGRESS,
      hydrated: false,

      hydrate: async () => {
        if (get().hydrated) return;
        set({ hydrated: true });
      },

      startLesson: (lessonSlug) => set({ currentLesson: lessonSlug, lastActivity: Date.now() }),

      setCurrentPath: (currentPath) => set({ currentPath, lastActivity: Date.now() }),

      completeLesson: (lessonSlug, xp) => {
        const { completedLessons, awardXp } = get();
        if (completedLessons.includes(lessonSlug)) return;
        awardXp(xp, "lesson_completed", "Lesson completed", lessonSlug);
        set({ completedLessons: [...completedLessons, lessonSlug] });
      },

      completeLab: (labId, xp) => {
        const { completedLabs, awardXp } = get();
        if (completedLabs.includes(labId)) return;
        awardXp(xp, "lab_completed", "Challenge completed", labId);
        set({ completedLabs: [...completedLabs, labId] });
      },

      setResumePosition: (lessonSlug, scrollPosition) =>
        set({
          resume: { lessonSlug, scrollPosition, updatedAt: Date.now() },
          lastActivity: Date.now(),
        }),

      awardXp: (amount, type, message, lessonSlug) => {
        const { totalXp, addEvent } = get();
        addEvent({ type, message, xp: amount, lessonSlug });
        set({ totalXp: totalXp + amount, lastActivity: Date.now() });
      },

      addEvent: (event) => {
        const { activity } = get();
        const next = [makeEvent(event), ...activity].slice(0, 200);
        set({ activity: next });
      },

      resetProgress: () => set({ ...DEFAULT_PROGRESS }),
    }),
    {
      name: STORAGE_KEYS.progress,
      storage: createAsyncJSONStorage(),
      partialize: (state) => ({
        completedLessons: state.completedLessons,
        completedLabs: state.completedLabs,
        currentLesson: state.currentLesson,
        currentPath: state.currentPath,
        totalXp: state.totalXp,
        lastActivity: state.lastActivity,
        streak: state.streak,
        resume: state.resume,
        badges: state.badges,
        achievements: state.achievements,
        activity: state.activity,
      }),
    },
  ),
);

export { DEFAULT_PROGRESS };
