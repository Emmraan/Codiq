/** Progress data model. Persisted via the progress store (see store/progress-store.ts). */

export type ProgressEventType =
  | "lesson_completed"
  | "lab_completed"
  | "xp_awarded"
  | "badge_earned"
  | "achievement_earned"
  | "path_started"
  | "lesson_started";

export interface ProgressState {
  /** Lesson slugs that have been fully completed. */
  completedLessons: string[];
  /** Challenge/lab IDs that have been passed. */
  completedLabs: string[];
  /** The most recently opened lesson slug. */
  currentLesson?: string;
  /** The most recently opened learning path slug. */
  currentPath?: string;
  totalXp: number;
  lastActivity: number;
  streak: {
    current: number;
    best: number;
    lastActiveDate?: string; // ISO date (yyyy-mm-dd)
  };
  resume: {
    lessonSlug?: string;
    /** Y-scroll position on the lesson page, for "resume where you left off". */
    scrollPosition?: number;
    updatedAt?: number;
  };
  badges: string[];
  achievements: string[];
  /** Event log entries (bounded, newest first) for the activity feed. */
  activity: ProgressEvent[];
}

export interface ProgressEvent {
  id: string;
  type: ProgressEventType;
  message: string;
  xp?: number;
  at: number;
  lessonSlug?: string;
}

export interface DailyGoal {
  targetXp: number;
  lastResetDate: string; // ISO date
  earnedToday: number;
}

export interface WeeklyGoal {
  targetXp: number;
  lastResetDate: string; // ISO date
  earnedThisWeek: number;
}
