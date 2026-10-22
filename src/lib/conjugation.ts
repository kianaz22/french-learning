import type { ConjugationExercise, VerbGroup } from '../data/types';
import { answersMatch, normalizeAnswer } from './normalize';

export const VERB_GROUP_ORDER: VerbGroup[] = ['er', 'ir', 're', 'pronominal', 'irregular'];

export const verbGroupLabel: Record<VerbGroup, string> = {
  er: '1er groupe · -er',
  ir: '3e groupe · -ir',
  re: '3e groupe · -re',
  pronominal: 'Pronominal',
  irregular: 'Irrégulier',
};

export function groupVerbs(verbs: ConjugationExercise[]) {
  return VERB_GROUP_ORDER
    .map((group) => ({
      group,
      label: verbGroupLabel[group],
      items: verbs.filter((v) => v.group === group),
    }))
    .filter((g) => g.items.length > 0);
}

export type FormParts = {
  prefix: string;
  stem: string;
  ending: string;
};

export function splitForm(form: string, stem?: string): FormParts | null {
  if (!stem) return null;
  const i = form.toLowerCase().indexOf(stem.toLowerCase());
  if (i === -1) return null;
  const ending = form.slice(i + stem.length);
  if (!ending) return null;
  return {
    prefix: form.slice(0, i),
    stem: form.slice(i, i + stem.length),
    ending,
  };
}

export function conjugationMatches(input: string, expected: string, pronoun: string): boolean {
  if (!input.trim()) return false;
  if (answersMatch(input, expected)) return true;

  const prefixes = new Set<string>();
  for (const p of pronoun.split('/')) {
    const np = normalizeAnswer(p);
    if (np) prefixes.add(np);
  }
  for (const p of ['je', 'j', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles']) {
    prefixes.add(p);
  }

  const got = normalizeAnswer(input);
  for (const p of prefixes) {
    if (answersMatch(input, `${p} ${expected}`)) return true;
    if (got.startsWith(`${p} `) && answersMatch(got.slice(p.length), expected)) return true;
  }

  if (got.startsWith("j'") || got.startsWith('j ')) {
    if (answersMatch(got.replace(/^j[' ]/, ''), expected)) return true;
  }

  const want = normalizeAnswer(expected);
  const wantParts = want.split(/\s+/);
  if (wantParts.length > 1 && answersMatch(input, wantParts.slice(1).join(' '))) return true;

  return false;
}
