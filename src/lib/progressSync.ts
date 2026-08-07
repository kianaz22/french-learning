import type { SessionStepId } from '../data/unit1';
import { getSupabase } from './supabase';
import { defaultProgress, type ProgressState } from '../types/progress';

export const STORAGE_KEY = 'latelier-unit1-progress';
export const CURRENT_UNIT = 1;
export const GUEST_KEY = 'latelier-guest-mode';

export function loadLocalProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return { ...defaultProgress };
}

export function saveLocalProgress(state: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

export async function fetchRemoteProgress(userId: string): Promise<ProgressState | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('user_progress')
    .select('progress')
    .eq('user_id', userId)
    .eq('unit_number', CURRENT_UNIT)
    .maybeSingle();

  if (error || !data?.progress) return null;
  return { ...defaultProgress, ...(data.progress as Partial<ProgressState>) };
}

export async function saveRemoteProgress(userId: string, progress: ProgressState): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase.from('user_progress').upsert(
    {
      user_id: userId,
      unit_number: CURRENT_UNIT,
      progress,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,unit_number' },
  );

  if (error) throw error;
}

export async function syncProgressForUser(userId: string): Promise<ProgressState> {
  const local = loadLocalProgress();
  const remote = await fetchRemoteProgress(userId);
  const merged = remote ? mergeProgress(local, remote) : local;
  saveLocalProgress(merged);
  await saveRemoteProgress(userId, merged);
  return merged;
}
