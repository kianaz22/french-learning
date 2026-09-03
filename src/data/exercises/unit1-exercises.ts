import type { MissionPrompt } from '../types';

export { unit1Quiz } from './unit1-quiz';
export { unit1Fill } from './unit1-fill';

export const unit1MissionsExtra: MissionPrompt[] = [
  {
    id: 'm9',
    title: 'Tutoiement ou vouvoiement',
    instruction:
      'Rewrite the same first meeting twice: once with tu (classmate) and once with vous (a teacher). Keep names, nationality, and age.',
    example:
      "Salut ! Comment tu t'appelles ? — Je m'appelle Nora. J'ai vingt ans. Je suis belge. / Bonjour madame. Comment vous appelez-vous ? — Je m'appelle Nora. J'ai vingt ans. Je suis belge.",
    checklist: ['One tu version', 'One vous version', "s'appeler", 'Age or nationality'],
  },
  {
    id: 'm10',
    title: 'Accordez les nationalités',
    instruction:
      'Write 5 sentences about a mixed group (at least one man, one woman, one plural). Use four different nationality adjectives with correct agreement.',
    example:
      'Paul est français. Léa est canadienne. Ils sont italiens. Elles sont espagnoles. Notre professeur est belge.',
    checklist: ['Masculine form', 'Feminine form', 'Plural form', 'No capital on the adjective'],
  },
  {
    id: 'm11',
    title: 'Mes langues',
    instruction:
      'Write 4 sentences about languages you and two other people speak. Include quelles langues and at least one negation.',
    example:
      "Je parle français et anglais. Mon ami parle espagnol. Il ne parle pas allemand. Quelles langues tu parles, toi ?",
    checklist: ['parler + language', 'quelles langues', 'ne … pas', 'Three people total'],
  },
  {
    id: 'm12',
    title: 'Portraits de métiers',
    instruction:
      "Present three people with c'est + name, then il/elle est + profession (no article) and one extra detail.",
    example:
      "Elle, c'est Inès. Elle est architecte. Elle habite à Lyon. Lui, c'est Karim. Il est journaliste. Il a trente ans.",
    checklist: ["c'est + name", 'être + profession, no article', 'One extra detail each', 'Three people'],
  },
  {
    id: 'm13',
    title: 'L’âge en lettres',
    instruction:
      'Write 5 sentences giving ages. Write every number in letters (not digits). Include one 21/31/41/51/61 form and one hyphenated number.',
    example:
      "J'ai vingt et un ans. Mon frère a vingt-deux ans. Ma sœur a seize ans. Nos parents ont quarante-cinq ans. Mon oncle a soixante et un ans.",
    checklist: ['All numbers in letters', 'vingt et un (or 31/41/51/61)', 'One hyphenated number', 'avoir + ans'],
  },
  {
    id: 'm14',
    title: 'Salutations du jour',
    instruction:
      'Write four mini-exchanges: morning class, evening with friends, meeting a stranger, and leaving. Match the register.',
    example:
      "— Bonjour ! Ça va ? — Oui, ça va bien, merci. / — Bonsoir ! Salut ! — À plus ! / — Bonjour monsieur. Comment allez-vous ? — Très bien, merci. — Au revoir, bonne soirée.",
    checklist: ['Bonjour and bonsoir', 'Salut or À plus', 'Formal Comment allez-vous / Au revoir', 'Enchanté(e) or merci'],
  },
  {
    id: 'm15',
    title: 'Passez à la négation',
    instruction:
      'Write 3 affirmative sentences about yourself, then rewrite each with ne … pas (être, avoir, and s’appeler or habiter).',
    example:
      "Je suis anglais. → Je ne suis pas anglais. J'ai faim. → Je n'ai pas faim. Je m'appelle Tom. → Je ne m'appelle pas Tom.",
    checklist: ['ne … pas with être', "n' with avoir or habiter", "ne m'appelle pas or similar", 'Affirmative + negative pairs'],
  },
  {
    id: 'm16',
    title: "C'est ou il/elle est ?",
    instruction:
      "Write 6 sentences: three identifications (c'est / ce sont) and three descriptions (il/elle est + nationality, job, or state).",
    example:
      "C'est Marie. C'est une journaliste. Ce sont mes amis. Elle est française. Il est chef. Ils sont fatigués.",
    checklist: ["c'est + name or article", 'ce sont + plural', 'il/elle est + adjective or job', 'Six sentences'],
  },
  {
    id: 'm17',
    title: 'Trois façons de demander',
    instruction:
      'Ask the same three facts (name, age, origin) using intonation, est-ce que, and inversion — nine questions total, or three triples.',
    example:
      "Tu t'appelles Léa ? / Est-ce que tu t'appelles Léa ? / Comment t'appelles-tu ? Tu as vingt ans ? / Est-ce que tu as vingt ans ? / Quel âge as-tu ?",
    checklist: ['Intonation question', 'est-ce que', 'Inversion with hyphen', 'Name, age, origin'],
  },
  {
    id: 'm18',
    title: 'Pronoms en scène',
    instruction:
      'Write a 6-line scene that uses je, tu, il/elle, on, nous, and a tonic pronoun (moi, toi, lui, eux…).',
    example:
      "Moi, je m'appelle Sam. Toi, tu viens d'où ? Elle s'appelle Inès. On est étudiants. Nous avons vingt ans. Lui, c'est Karim.",
    checklist: ['je and tu', 'il or elle', 'on', 'Tonic pronoun (moi/toi/lui/eux)'],
  },
  {
    id: 'm19',
    title: 'Questionnaire quel / quelle',
    instruction:
      'Write 6 questions with quel, quelle, quels, or quelles. Agree with the noun (âge, nationalité, nom, langues, profession…).',
    example:
      "Quel âge as-tu ? Quelle est ta nationalité ? Quel est ton nom ? Quelles langues tu parles ? Quelle est votre profession ? Quels sont tes collègues ?",
    checklist: ['quel + masculine', 'quelle + feminine', 'quelles or quels plural', 'At least one Quelle est / Quel est'],
  },
  {
    id: 'm20',
    title: 'Premier jour de cours',
    instruction:
      'Write a short paragraph (7–8 sentences) as if it is your first day: greeting, name, origin with du/de/des, nationality, age, profession or studies, languages, and how you feel.',
    example:
      "Bonjour ! Je m'appelle Inès. Je viens du Canada. Je suis canadienne. J'ai vingt-trois ans. Je suis étudiante. Je parle français et anglais. Aujourd'hui j'ai un peu peur, mais je suis contente.",
    checklist: ["s'appeler", 'venir de (du/de/des)', 'Nationality agreement', 'avoir + âge and être or avoir sensation'],
  },
];
