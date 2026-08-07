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
  options?: string[];
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

export const unit1Meta = {
  number: 1,
  title: "C'est qui ?",
  objectives: [
    'Se présenter et présenter quelqu\'un',
    'Dire sa nationalité',
    'Demander et donner des informations',
  ],
};

export const flashcards: Flashcard[] = [
  { id: 'g1', french: 'Bonjour', english: 'Hello / Good day', category: 'Salutations' },
  { id: 'g2', french: 'Bonsoir', english: 'Good evening', category: 'Salutations' },
  { id: 'g3', french: 'Salut', english: 'Hi / Bye (informal)', category: 'Salutations' },
  { id: 'g4', french: 'Au revoir', english: 'Goodbye', category: 'Salutations' },
  { id: 'g5', french: 'Comment tu t\'appelles ?', english: 'What is your name? (tu)', category: 'Salutations' },
  { id: 'g6', french: 'Je m\'appelle…', english: 'My name is…', category: 'Salutations' },
  { id: 'g7', french: 'Enchanté(e)', english: 'Nice to meet you', category: 'Salutations' },
  { id: 'g8', french: 'Ça va ?', english: 'How are you?', category: 'Salutations' },
  { id: 'g9', french: 'S\'il vous plaît', english: 'Please (formal)', category: 'Politesse' },
  { id: 'g10', french: 'Merci', english: 'Thank you', category: 'Politesse' },
  { id: 'g11', french: 'Pardon', english: 'Sorry / Excuse me', category: 'Politesse' },
  { id: 'p1', french: 'un acteur / une actrice', english: 'actor / actress', category: 'Professions' },
  { id: 'p2', french: 'un chef / une cheffe', english: 'chef', category: 'Professions' },
  { id: 'p3', french: 'un styliste / une styliste', english: 'fashion designer', category: 'Professions' },
  { id: 'p4', french: 'un journaliste', english: 'journalist', category: 'Professions' },
  { id: 'p5', french: 'un photographe', english: 'photographer', category: 'Professions' },
  { id: 'p6', french: 'un footballeur / une footballeuse', english: 'football player', category: 'Professions' },
  { id: 'c1', french: 'la France', english: 'France', hint: 'féminin → la', category: 'Pays' },
  { id: 'c2', french: 'le Canada', english: 'Canada', hint: 'masculin → le', category: 'Pays' },
  { id: 'c3', french: 'le Sénégal', english: 'Senegal', category: 'Pays' },
  { id: 'c4', french: 'la Belgique', english: 'Belgium', category: 'Pays' },
  { id: 'c5', french: 'la Suisse', english: 'Switzerland', category: 'Pays' },
  { id: 'c6', french: 'l\'Algérie', english: 'Algeria', hint: 'voyelle → l\'', category: 'Pays' },
  { id: 'c7', french: 'les États-Unis', english: 'United States', hint: 'pluriel → les', category: 'Pays' },
  { id: 'n1', french: 'français / française', english: 'French', category: 'Nationalités' },
  { id: 'n2', french: 'canadien / canadienne', english: 'Canadian', category: 'Nationalités' },
  { id: 'n3', french: 'sénégalais / sénégalaise', english: 'Senegalese', category: 'Nationalités' },
  { id: 'n4', french: 'belge', english: 'Belgian', hint: 'invariable in gender', category: 'Nationalités' },
  { id: 'n5', french: 'marocain / marocaine', english: 'Moroccan', category: 'Nationalités' },
  { id: 'n6', french: 'américain / américaine', english: 'American', category: 'Nationalités' },
  { id: 's1', french: 'J\'ai faim', english: 'I\'m hungry', category: 'Sensations' },
  { id: 's2', french: 'J\'ai soif', english: 'I\'m thirsty', category: 'Sensations' },
  { id: 's3', french: 'J\'ai chaud', english: 'I\'m hot', category: 'Sensations' },
  { id: 's4', french: 'J\'ai froid', english: 'I\'m cold', category: 'Sensations' },
  { id: 's5', french: 'Je suis fatigué(e)', english: 'I\'m tired', category: 'Sensations' },
  { id: 's6', french: 'Je suis en forme', english: 'I\'m in good shape', category: 'Sensations' },
];

export const multipleChoice: MultipleChoiceExercise[] = [
  {
    id: 'mc1',
    question: 'Complete: « Moi, je ___ Paul. »',
    options: ['m\'appelle', 'appelle', 's\'appelle', 'appelles'],
    correctIndex: 0,
    explanation: 'With je, use je m\'appelle (reflexive verb s\'appeler).',
  },
  {
    id: 'mc2',
    question: 'Which article goes with « ___ France »?',
    options: ['le', 'la', 'les', 'l\''],
    correctIndex: 1,
    explanation: 'France is a feminine country name → la France.',
  },
  {
    id: 'mc3',
    question: 'Which article goes with « ___ Canada »?',
    options: ['le', 'la', 'les', 'un'],
    correctIndex: 0,
    explanation: 'Canada is masculine → le Canada.',
  },
  {
    id: 'mc4',
    question: 'Emma is Canadian (feminine). She is…',
    options: ['canadien', 'canadienne', 'canadiens', 'canadiennes'],
    correctIndex: 1,
    explanation: 'Feminine nationality adjectives add -e: canadienne.',
  },
  {
    id: 'mc5',
    question: 'Negation: « Je ___ suis ___ français. »',
    options: ['ne … pas', 'pas … ne', 'non … pas', 'ne … no'],
    correctIndex: 0,
    explanation: 'Standard negation wraps the verb: ne + verb + pas.',
  },
  {
    id: 'mc6',
    question: 'How do you ask someone\'s age informally?',
    options: ['Tu as quel âge ?', 'Tu es quel âge ?', 'Tu as quelle année ?', 'Tu es combien ?'],
    correctIndex: 0,
    explanation: 'Age uses avoir: Tu as quel âge ?',
  },
  {
    id: 'mc7',
    question: '« Lui, ___ Omar Sy. »',
    options: ['c\'est', 'il est', 'elle est', 'ce sont'],
    correctIndex: 0,
    explanation: 'Use c\'est to identify/present someone.',
  },
  {
    id: 'mc8',
    question: '23 in French is…',
    options: ['vingt-trois', 'trente-trois', 'deux-trois', 'vingt trois'],
    correctIndex: 0,
    explanation: '21–69 use vingt/trente/etc. + hyphen + units.',
  },
];

export const fillBlank: FillBlankExercise[] = [
  { id: 'fb1', prompt: 'Tu t\'___ comment ?', answer: 'appelles', hint: 's\'appeler, tu form' },
  { id: 'fb2', prompt: 'Elle s\'___ Marie.', answer: 'appelle', hint: '3rd person singular' },
  { id: 'fb3', prompt: 'Je ___ français.', answer: 'suis', hint: 'être, je form' },
  { id: 'fb4', prompt: 'Ils ___ canadiens.', answer: 'sont', hint: 'être, ils form' },
  { id: 'fb5', prompt: 'J\'___ 25 ans.', answer: 'ai', hint: 'avoir for age' },
  { id: 'fb6', prompt: 'Tu ___ quel âge ?', answer: 'as', hint: 'avoir, tu form' },
  { id: 'fb7', prompt: 'Je ne ___ pas anglais.', answer: 'suis', hint: 'negation with être' },
  { id: 'fb8', prompt: '___ est sa nationalité ?', answer: 'Quelle', hint: 'quelle + feminine noun' },
  { id: 'fb9', prompt: 'Lui, ___ Omar Sy.', answer: 'c\'est', hint: 'present / identify someone' },
  { id: 'fb10', prompt: 'Nous ___ étudiants.', answer: 'sommes', hint: 'être, nous form' },
];

export const conjugationExercises: ConjugationExercise[] = [
  {
    id: 'conj1',
    verb: 's\'appeler',
    tense: 'Présent',
    english: 'to be called / named',
    rows: [
      { pronoun: 'je', answer: 'm\'appelle' },
      { pronoun: 'tu', answer: 't\'appelles' },
      { pronoun: 'il/elle', answer: 's\'appelle' },
      { pronoun: 'nous', answer: 'nous appelons' },
      { pronoun: 'vous', answer: 'vous appelez' },
      { pronoun: 'ils/elles', answer: 's\'appellent' },
    ],
  },
  {
    id: 'conj2',
    verb: 'être',
    tense: 'Présent',
    english: 'to be',
    rows: [
      { pronoun: 'je', answer: 'suis' },
      { pronoun: 'tu', answer: 'es' },
      { pronoun: 'il/elle', answer: 'est' },
      { pronoun: 'nous', answer: 'sommes' },
      { pronoun: 'vous', answer: 'êtes' },
      { pronoun: 'ils/elles', answer: 'sont' },
    ],
  },
  {
    id: 'conj3',
    verb: 'avoir',
    tense: 'Présent',
    english: 'to have',
    rows: [
      { pronoun: 'je', answer: 'ai' },
      { pronoun: 'tu', answer: 'as' },
      { pronoun: 'il/elle', answer: 'a' },
      { pronoun: 'nous', answer: 'avons' },
      { pronoun: 'vous', answer: 'avez' },
      { pronoun: 'ils/elles', answer: 'ont' },
    ],
  },
];

export const missionPrompts = [
  {
    id: 'm1',
    title: 'Présentez-vous',
    instruction: 'Write 3–4 sentences introducing yourself: name, nationality, age, and how you feel today.',
    example: 'Bonjour ! Je m\'appelle… Je suis… J\'ai… ans. Aujourd\'hui, je suis en forme.',
    checklist: ['Name (je m\'appelle)', 'Nationality (je suis + adjective)', 'Age (j\'ai + number + ans)', 'Feeling (ça va / sensation)'],
  },
  {
    id: 'm2',
    title: 'Présentez quelqu\'un',
    instruction: 'Describe a friend or celebrity using c\'est, il/elle est, and their profession.',
    example: 'Lui, c\'est Omar Sy. Il est français. Il est acteur.',
    checklist: ['C\'est + name', 'Il/Elle est + nationality', 'Il/Elle est + profession'],
  },
  {
    id: 'm3',
    title: 'Demandez des informations',
    instruction: 'Write 4 questions you could ask a new classmate (name, age, nationality, languages).',
    example: 'Comment tu t\'appelles ? Tu as quel âge ? Quelle est ta nationalité ? Tu parles quelles langues ?',
    checklist: ['Question with s\'appeler', 'Question with avoir (âge)', 'Question with quel/quelle', 'Polite form optional (vous)'],
  },
];

export const dailySessionSteps = [
  { id: 'flashcards', label: 'Cartes', duration: '5 min', description: 'Review vocabulary' },
  { id: 'quiz', label: 'Quiz', duration: '5 min', description: 'Multiple choice' },
  { id: 'fill', label: 'Phrases', duration: '5 min', description: 'Fill in the blank' },
  { id: 'conjugate', label: 'Verbes', duration: '5 min', description: 'Conjugation drill' },
  { id: 'mission', label: 'Mission', duration: '5 min', description: 'Write & produce' },
] as const;

export type SessionStepId = (typeof dailySessionSteps)[number]['id'];

export const flashcardCategories = [...new Set(flashcards.map((c) => c.category))];
