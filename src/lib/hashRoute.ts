import type { SessionStepId } from '../data/types';
import { COURSE_UNITS } from './course';
import { isSessionStep } from './session';

export type AppView = 'home' | 'learn' | 'review' | SessionStepId;

export type RouteState = {
  view: AppView;
  readingUnit: number | null;
  situationId?: string;
};

const STEP_SLUG: Record<SessionStepId, string> = {
  flashcards: 'cartes',
  quiz: 'quiz',
  fill: 'phrases',
  conjugate: 'verbes',
  mission: 'mission',
};

const SLUG_STEP = Object.fromEntries(
  Object.entries(STEP_SLUG).map(([id, slug]) => [slug, id]),
) as Record<string, SessionStepId>;

function normalizeHash(hash: string): string {
  const raw = hash.replace(/^#/, '');
  return raw.startsWith('/') ? raw : `/${raw}`;
}

export function hashEquals(a: string, b: string): boolean {
  const left = normalizeHash(a || '#/');
  const right = normalizeHash(b || '#/');
  return (left === '/' ? '/' : left.replace(/\/$/, '')) === (right === '/' ? '/' : right.replace(/\/$/, ''));
}

export function parseHash(hash: string): RouteState {
  const parts = normalizeHash(hash)
    .split('/')
    .filter(Boolean);
  if (parts.length === 0) return { view: 'home', readingUnit: null };
  if (parts[0] === 'revoir') return { view: 'review', readingUnit: null };
  if (parts[0] === 'lecon') {
    const n = parts[1] ? Number(parts[1]) : NaN;
    const readingUnit = (COURSE_UNITS as readonly number[]).includes(n) ? n : null;
    const situationId = parts[2] || undefined;
    return { view: 'learn', readingUnit, situationId };
  }
  const step = SLUG_STEP[parts[0]];
  if (step && isSessionStep(step)) return { view: step, readingUnit: null };
  return { view: 'home', readingUnit: null };
}

export function toHash(state: RouteState): string {
  if (state.view === 'home') return '#/';
  if (state.view === 'review') return '#/revoir';
  if (state.view === 'learn') {
    if (state.readingUnit && state.situationId) {
      return `#/lecon/${state.readingUnit}/${state.situationId}`;
    }
    if (state.readingUnit) return `#/lecon/${state.readingUnit}`;
    return '#/lecon';
  }
  return `#/${STEP_SLUG[state.view]}`;
}
