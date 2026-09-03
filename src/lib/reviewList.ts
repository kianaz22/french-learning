import type { UnitContent } from '../data/types';
import type { ReviewItem, ReviewKind } from '../types/progress';

export function reviewKey(item: ReviewItem): string {
  return item.pronoun
    ? `${item.kind}:${item.id}:${item.pronoun}`
    : `${item.kind}:${item.id}`;
}

export function applyReviewDelta(
  items: ReviewItem[],
  cleared: string[],
  add: ReviewItem[],
  remove: ReviewItem[],
): { reviewItems: ReviewItem[]; reviewCleared: string[] } {
  const addKeys = new Set(add.map(reviewKey));
  const removeKeys = new Set(remove.map(reviewKey).filter((k) => !addKeys.has(k)));

  const nextCleared = [
    ...new Set([...cleared.filter((k) => !addKeys.has(k)), ...removeKeys]),
  ];

  const byKey = new Map<string, ReviewItem>();
  for (const item of items) {
    const key = reviewKey(item);
    if (!removeKeys.has(key) && !nextCleared.includes(key)) {
      byKey.set(key, item);
    }
  }
  for (const item of add) {
    const key = reviewKey(item);
    if (!nextCleared.includes(key)) byKey.set(key, item);
  }

  return { reviewItems: [...byKey.values()], reviewCleared: nextCleared };
}

export function mergeReviewLists(
  localItems: ReviewItem[],
  localCleared: string[],
  remoteItems: ReviewItem[],
  remoteCleared: string[],
): { reviewItems: ReviewItem[]; reviewCleared: string[] } {
  const cleared = [...new Set([...localCleared, ...remoteCleared])];
  const byKey = new Map<string, ReviewItem>();
  for (const item of [...localItems, ...remoteItems]) {
    const key = reviewKey(item);
    if (!cleared.includes(key)) byKey.set(key, item);
  }
  return { reviewItems: [...byKey.values()], reviewCleared: cleared };
}

export const reviewKindLabel: Record<ReviewKind, string> = {
  quiz: 'Quiz',
  fill: 'Phrases',
  flashcard: 'Cartes',
  conjugate: 'Verbes',
};

export function liveReviewItems(unit: UnitContent, items: ReviewItem[]): ReviewItem[] {
  return items.filter((item) => resolveReviewPreview(unit, item) !== null);
}

export function resolveReviewPreview(unit: UnitContent, item: ReviewItem): string | null {
  if (item.kind === 'quiz') {
    return unit.multipleChoice.find((q) => q.id === item.id)?.question ?? null;
  }
  if (item.kind === 'fill') {
    return unit.fillBlank.find((q) => q.id === item.id)?.prompt ?? null;
  }
  if (item.kind === 'flashcard') {
    const card = unit.flashcards.find((c) => c.id === item.id);
    return card ? `${card.french} — ${card.english}` : null;
  }
  const verb = unit.conjugationExercises.find((v) => v.id === item.id);
  const row = verb?.rows.find((r) => r.pronoun === item.pronoun);
  if (!verb || !row) return null;
  return `${verb.verb} · ${item.pronoun}`;
}
