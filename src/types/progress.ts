import type { SessionStepId } from '../data/types';

export type ReviewKind = 'quiz' | 'fill' | 'flashcard' | 'conjugate';

export type ReviewItem = {
  kind: ReviewKind;
  id: string;
  pronoun?: string;
};

export type ProgressState = {
  completedSteps: SessionStepId[];
  lastSessionDate: string | null;
  streak: number;
  flashcardScores: Record<string, 'know' | 'learning'>;
  quizScore: number | null;
  fillScore: number | null;
  conjugationComplete: boolean;
  missionsCompleted: string[];
  reviewItems: ReviewItem[];
  reviewCleared: string[];
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
  reviewItems: [],
  reviewCleared: [],
};

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';
