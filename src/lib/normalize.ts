export function normalizeAnswer(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/['’‘`]/g, "'")
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function variants(s: string): Set<string> {
  const base = normalizeAnswer(s)
    .replace(/[.,;:!?…]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\bj\s+/g, "j'")
    .replace(/\s+'/g, "'");
  return new Set([
    base,
    base.replace(/'/g, ''),
    base.replace(/'/g, ' '),
    base.replace(/\s/g, ''),
    base.replace(/'/g, '').replace(/\s/g, ''),
  ]);
}

export function answersMatch(input: string, expected: string): boolean {
  if (!input.trim()) return false;
  const got = variants(input);
  const want = variants(expected);
  for (const a of got) {
    if (want.has(a)) return true;
  }
  return false;
}
