import type { SessionStepId } from '../data/unit1';

export type ProgressState = {
  completedSteps: SessionStepId[];
  lastSessionDate: string | null;
  streak: number;
  flashcardScores: Record<string, 'know' | 'learning'>;
  quizScore: number | null;
  fillScore: number | null;
  conjugationComplete: boolean;
  missionsCompleted: string[];
};

export const defaultProgress: ProgressState = {
  completedSteps: [],
  lastSessionDate: null,
  streak: 0,
  flashcardScores: {},
  quizScore: null,
  fillScore: null,
  conjugationComplete: false,
  missionsCompleted: [],
};

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';
