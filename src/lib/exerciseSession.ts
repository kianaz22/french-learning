export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function sampleSession<T>(pool: T[], size: number): T[] {
  if (pool.length <= size) return shuffle(pool);
  return shuffle(pool).slice(0, size);
}
