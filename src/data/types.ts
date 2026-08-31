export type Flashcard = {
  id: string;
  french: string;
  english: string;
  hint?: string;
  category: string;
};

export type FillBlankExercise = {
  id: string;
  prompt: string;
  answer: string;
  hint?: string;
};

export type MultipleChoiceExercise = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type ConjugationRow = {
  pronoun: string;
  answer: string;
};

export type ConjugationExercise = {
  id: string;
  verb: string;
  tense: string;
  english: string;
  rows: ConjugationRow[];
};

export type MissionPrompt = {
  id: string;
  title: string;
  instruction: string;
  example: string;
  checklist: string[];
};

export type GrammarPoint = {
  id: string;
  title: string;
  summary: string;
  rules?: string[];
  examples: { french: string; english: string }[];
  tip?: string;
};

export type KeyPhrase = {
  french: string;
  english: string;
  context?: string;
};

export type UnitLesson = {
  overview: string;
  grammar: GrammarPoint[];
  keyPhrases: KeyPhrase[];
  cultureNote?: string;
};

export type UnitMeta = {
  number: number;
  title: string;
  objectives: string[];
};

export const dailySessionSteps = [
  { id: 'flashcards', label: 'Cartes', duration: '5 min', description: 'Review vocabulary' },
  { id: 'quiz', label: 'Quiz', duration: '8 min', description: '12 questions from a bank of 24' },
  { id: 'fill', label: 'Phrases', duration: '8 min', description: '12 fill-in-the-blank drills' },
  { id: 'conjugate', label: 'Verbes', duration: '5 min', description: 'Conjugation drill' },
  { id: 'mission', label: 'Mission', duration: '5 min', description: 'Write & produce' },
] as const;

export const QUIZ_SESSION_SIZE = 12;
export const FILL_SESSION_SIZE = 12;

export type SessionStepId = (typeof dailySessionSteps)[number]['id'];

export type UnitContent = {
  meta: UnitMeta;
  lesson: UnitLesson;
  flashcards: Flashcard[];
  multipleChoice: MultipleChoiceExercise[];
  fillBlank: FillBlankExercise[];
  conjugationExercises: ConjugationExercise[];
  missionPrompts: MissionPrompt[];
};

export function flashcardCategories(unit: UnitContent): string[] {
  return [...new Set(unit.flashcards.map((c) => c.category))];
}
