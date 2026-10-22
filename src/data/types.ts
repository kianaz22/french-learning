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

export type VerbGroup = 'er' | 'ir' | 're' | 'irregular' | 'pronominal';

export type ConjugationExample = {
  french: string;
  english: string;
};

export type ConjugationExercise = {
  id: string;
  verb: string;
  tense: string;
  english: string;
  group: VerbGroup;
  stem?: string;
  patternNote?: string;
  examples?: ConjugationExample[];
  rows: ConjugationRow[];
};

export type MissionPrompt = {
  id: string;
  title: string;
  instruction: string;
  example: string;
  checklist: string[];
};

export type GrammarExample = {
  french: string;
  english: string;
  note?: string;
};

export type CommonMistake = {
  wrong: string;
  right: string;
  why: string;
};

export type GrammarPoint = {
  id: string;
  title: string;
  summary: string;
  explanation?: string;
  rules?: string[];
  examples: GrammarExample[];
  commonMistakes?: CommonMistake[];
  tip?: string;
};

export type KeyPhrase = {
  french: string;
  english: string;
  context?: string;
};

export type DialogueLine = {
  speaker: string;
  french: string;
  english: string;
};

export type LessonDialogue = {
  title: string;
  setting?: string;
  lines: DialogueLine[];
};

export type CultureNote = {
  title: string;
  text: string;
};

export type LessonSituation = {
  id: string;
  number: number;
  title: string;
  goal: string;
  grammarIds: string[];
  phraseContexts: string[];
  verbIds?: string[];
};

export type UnitLesson = {
  overview: string;
  memo?: string;
  situations?: LessonSituation[];
  grammar: GrammarPoint[];
  keyPhrases: KeyPhrase[];
  cultureNote?: string;
  cultureNotes?: CultureNote[];
  dialogue?: LessonDialogue;
};

export type UnitMeta = {
  number: number;
  title: string;
  objectives: string[];
};

export const dailySessionSteps = [
  { id: 'flashcards', label: 'Cartes', duration: '8 min', description: 'Un jeu de vocabulaire' },
  { id: 'quiz', label: 'Quiz', duration: '12 min', description: '20 questions de la banque' },
  { id: 'fill', label: 'Phrases', duration: '12 min', description: '20 phrases à compléter' },
  { id: 'conjugate', label: 'Verbes', duration: '8 min', description: '5 tableaux de conjugaison' },
  { id: 'mission', label: 'Mission', duration: '8 min', description: 'Écrire et produire' },
] as const;

export const QUIZ_SESSION_SIZE = 20;
export const FILL_SESSION_SIZE = 20;
export const FLASH_SESSION_SIZE = 36;
export const CONJ_SESSION_SIZE = 5;

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
