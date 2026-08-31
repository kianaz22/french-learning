import type { SessionStepId } from '../data/types';
import { getSupabase } from './supabase';
import { defaultProgress, type ProgressState } from '../types/progress';

export const GUEST_KEY = 'latelier-guest-mode';

export function storageKey(unitNumber: number) {
  return `latelier-unit${unitNumber}-progress`;
}

/** Migrate legacy unit-1-only key */
function migrateLegacyUnit1() {
  try {
    const legacy = localStorage.getItem('latelier-unit1-progress');
    if (legacy && !localStorage.getItem(storageKey(1))) {
      localStorage.setItem(storageKey(1), legacy);
    }
  } catch {
    /* ignore */
  }
}

export function loadLocalProgress(unitNumber: number): ProgressState {
  migrateLegacyUnit1();
  try {
    const raw = localStorage.getItem(storageKey(unitNumber));
    if (raw) return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return { ...defaultProgress };
}

export function saveLocalProgress(unitNumber: number, state: ProgressState) {
  localStorage.setItem(storageKey(unitNumber), JSON.stringify(state));
}

export function isGuestMode(): boolean {
  return sessionStorage.getItem(GUEST_KEY) === '1';
}

export function setGuestMode(enabled: boolean) {
  if (enabled) sessionStorage.setItem(GUEST_KEY, '1');
  else sessionStorage.removeItem(GUEST_KEY);
}

function unionSteps(a: SessionStepId[], b: SessionStepId[]): SessionStepId[] {
  return [...new Set([...a, ...b])];
}

function mergeFlashcards(
  a: Record<string, 'know' | 'learning'>,
  b: Record<string, 'know' | 'learning'>,
): Record<string, 'know' | 'learning'> {
  const merged = { ...a };
  for (const [id, rating] of Object.entries(b)) {
    if (rating === 'know' || merged[id] !== 'know') {
      merged[id] = rating;
    }
  }
  return merged;
}

function pickBestDate(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return a >= b ? a : b;
}

function maxScore(a: number | null, b: number | null): number | null {
  if (a === null) return b;
  if (b === null) return a;
  return Math.max(a, b);
}

export function mergeProgress(local: ProgressState, remote: ProgressState): ProgressState {
  return {
    completedSteps: unionSteps(local.completedSteps, remote.completedSteps),
    lastSessionDate: pickBestDate(local.lastSessionDate, remote.lastSessionDate),
    streak: Math.max(local.streak, remote.streak),
    flashcardScores: mergeFlashcards(local.flashcardScores, remote.flashcardScores),
    quizScore: maxScore(local.quizScore, remote.quizScore),
    fillScore: maxScore(local.fillScore, remote.fillScore),
    conjugationComplete: local.conjugationComplete || remote.conjugationComplete,
    missionsCompleted: [...new Set([...local.missionsCompleted, ...remote.missionsCompleted])],
  };
}

export async function fetchRemoteProgress(
  userId: string,
  unitNumber: number,
): Promise<ProgressState | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('user_progress')
    .select('progress')
    .eq('user_id', userId)
    .eq('unit_number', unitNumber)
    .maybeSingle();

  if (error || !data?.progress) return null;
  return { ...defaultProgress, ...(data.progress as Partial<ProgressState>) };
}

export async function saveRemoteProgress(
  userId: string,
  unitNumber: number,
  progress: ProgressState,
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase.from('user_progress').upsert(
    {
      user_id: userId,
      unit_number: unitNumber,
      progress,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,unit_number' },
  );

  if (error) throw error;
}

export async function syncProgressForUser(
  userId: string,
  unitNumber: number,
): Promise<ProgressState> {
  const local = loadLocalProgress(unitNumber);
  const remote = await fetchRemoteProgress(userId, unitNumber);
  const merged = remote ? mergeProgress(local, remote) : local;
  saveLocalProgress(unitNumber, merged);
  await saveRemoteProgress(userId, unitNumber, merged);
  return merged;
}
