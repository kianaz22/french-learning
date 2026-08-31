import type { UnitContent } from './types';
import { unit1Quiz, unit1Fill, unit1MissionsExtra } from './exercises/unit1-exercises';

export const unit1: UnitContent = {
  meta: {
    number: 1,
    title: "C'est qui ?",
    objectives: [
      "Se présenter et présenter quelqu'un",
      'Dire sa nationalité',
      'Demander et donner des informations',
    ],
  },
  lesson: {
    overview:
      "Dans cette unité, vous apprenez à vous présenter, à demander des informations sur une personne et à parler de nationalité, profession et âge. Les verbes clés sont s'appeler, être et avoir.",
    grammar: [
      {
        id: 'g1',
        title: "S'appeler — se présenter",
        summary: "Verbe pronominal pour dire son nom.",
        rules: [
          "Je m'appelle… / Tu t'appelles… / Il s'appelle…",
          "Comment tu t'appelles ? (informel) · Comment vous appelez-vous ? (formel)",
        ],
        examples: [
          { french: "Je m'appelle Emma.", english: 'My name is Emma.' },
          { french: "Comment tu t'appelles ?", english: 'What is your name?' },
        ],
        tip: "L'apostrophe remplace une voyelle : m'appelle, t'appelles, s'appelle.",
      },
      {
        id: 'g2',
        title: 'Être — nationalité et profession',
        summary: "On utilise être + adjectif ou nom pour décrire une personne.",
        rules: [
          'Je suis français(e). · Il est acteur. · Elle est journaliste.',
          "C'est + nom pour identifier : C'est Omar Sy.",
          'Négation : ne … pas → Je ne suis pas anglais.',
        ],
        examples: [
          { french: 'Je suis canadienne.', english: 'I am Canadian (f.).' },
          { french: "Lui, c'est Paul. Il est chef.", english: "That's Paul. He's a chef." },
        ],
      },
      {
        id: 'g3',
        title: 'Avoir — l\'âge',
        summary: "En français, on a un âge — on ne l'est pas.",
        rules: [
          "J'ai 25 ans. · Tu as quel âge ? · Quel âge as-tu ?",
          "Avoir aussi pour les sensations : J'ai faim, J'ai soif.",
        ],
        examples: [
          { french: "J'ai vingt-trois ans.", english: "I'm 23." },
          { french: "Tu as quel âge ?", english: 'How old are you?' },
        ],
      },
      {
        id: 'g4',
        title: 'Les articles avec les pays',
        summary: "La plupart des pays ont un article (le, la, les).",
        rules: [
          'Masculin → le : le Canada, le Sénégal',
          'Féminin → la : la France, la Belgique',
          'Nationalité : adjectif accordé → français / française',
        ],
        examples: [
          { french: 'Je viens du Canada.', english: 'I come from Canada.' },
          { french: 'Elle est sénégalaise.', english: 'She is Senegalese.' },
        ],
      },
      {
        id: 'g4b',
        title: 'de + le = du, de + les = des',
        summary: "Quand de est suivi d'un article défini, les deux mots se contractent.",
        rules: [
          'de + le → du : Je viens du Canada.',
          'de + les → des : Ils viennent des États-Unis.',
          'de + la → de la (pas de contraction) : de la République tchèque',
          "de + l' → de l' : de l'Italie, de l'Allemagne",
          'Pays féminins sans article après de : de France, de Belgique, de Suisse',
        ],
        examples: [
          { french: 'Je viens du Sénégal.', english: 'I come from Senegal.' },
          { french: 'Elle vient de France.', english: 'She comes from France.' },
          { french: 'Tu viens d\'où ? — Je viens du Canada.', english: 'Where are you from? — I\'m from Canada.' },
        ],
        tip: 'Avec venir de + pays : masculin → du, féminin → de + nom (sans la).',
      },
      {
        id: 'g5',
        title: 'Quel / quelle — poser des questions',
        summary: "Quel s'accorde avec le nom qui suit.",
        rules: [
          'Masculin → quel : Quel est ton nom ?',
          'Féminin → quelle : Quelle est ta nationalité ?',
        ],
        examples: [
          { french: 'Quelle est ta profession ?', english: 'What is your job?' },
          { french: 'Quels sports tu aimes ?', english: 'Which sports do you like?' },
        ],
      },
    ],
    keyPhrases: [
      { french: 'Bonjour ! Enchanté(e).', english: 'Hello! Nice to meet you.', context: 'Première rencontre' },
      { french: 'Ça va ? — Oui, ça va bien.', english: 'How are you? — Fine, thanks.', context: 'Salutations' },
      { french: 'Moi, je m\'appelle…', english: 'As for me, my name is…', context: 'Se présenter' },
      { french: 'Lui / Elle, c\'est…', english: 'He / She is…', context: 'Présenter quelqu\'un' },
      { french: 'Je viens du Canada.', english: 'I come from Canada.', context: 'Pays (de + le = du)' },
      { french: 'Elle vient de France.', english: 'She comes from France.', context: 'Pays féminin (de, sans la)' },
      { french: 'Tu parles quelles langues ?', english: 'Which languages do you speak?', context: 'Demander des infos' },
    ],
    cultureNote:
      "En France, on se tutoie (tu) entre amis et collègues proches, et on vouvoie (vous) avec un professeur, un inconnu ou en contexte formel. « Enchanté(e) » est très courant lors d'une première rencontre.",
  },
  flashcards: [
    { id: 'g1', french: 'Bonjour', english: 'Hello / Good day', category: 'Salutations' },
    { id: 'g2', french: 'Bonsoir', english: 'Good evening', category: 'Salutations' },
    { id: 'g3', french: 'Salut', english: 'Hi / Bye (informal)', category: 'Salutations' },
    { id: 'g4', french: 'Au revoir', english: 'Goodbye', category: 'Salutations' },
    { id: 'g5', french: "Comment tu t'appelles ?", english: 'What is your name? (tu)', category: 'Salutations' },
    { id: 'g6', french: "Je m'appelle…", english: 'My name is…', category: 'Salutations' },
    { id: 'g7', french: 'Enchanté(e)', english: 'Nice to meet you', category: 'Salutations' },
    { id: 'g8', french: 'Ça va ?', english: 'How are you?', category: 'Salutations' },
    { id: 'g9', french: "S'il vous plaît", english: 'Please (formal)', category: 'Politesse' },
    { id: 'g10', french: 'Merci', english: 'Thank you', category: 'Politesse' },
    { id: 'p1', french: 'un acteur / une actrice', english: 'actor / actress', category: 'Professions' },
    { id: 'p2', french: 'un chef / une cheffe', english: 'chef', category: 'Professions' },
    { id: 'p3', french: 'un styliste / une styliste', english: 'fashion designer', category: 'Professions' },
    { id: 'p4', french: 'un journaliste', english: 'journalist', category: 'Professions' },
    { id: 'c1', french: 'la France', english: 'France', hint: 'féminin → la', category: 'Pays' },
    { id: 'c2', french: 'le Canada', english: 'Canada', hint: 'masculin → le', category: 'Pays' },
    { id: 'c3', french: 'le Sénégal', english: 'Senegal', category: 'Pays' },
    { id: 'c4', french: 'la Belgique', english: 'Belgium', category: 'Pays' },
    { id: 'n1', french: 'français / française', english: 'French', category: 'Nationalités' },
    { id: 'n2', french: 'canadien / canadienne', english: 'Canadian', category: 'Nationalités' },
    { id: 'n3', french: 'sénégalais / sénégalaise', english: 'Senegalese', category: 'Nationalités' },
    { id: 's1', french: "J'ai faim", english: "I'm hungry", category: 'Sensations' },
    { id: 's2', french: "J'ai soif", english: "I'm thirsty", category: 'Sensations' },
    { id: 's3', french: 'Je suis fatigué(e)', english: "I'm tired", category: 'Sensations' },
  ],
  multipleChoice: unit1Quiz,
  fillBlank: unit1Fill,
  conjugationExercises: [
    {
      id: 'conj1',
      verb: "s'appeler",
      tense: 'Présent',
      english: 'to be called / named',
      rows: [
        { pronoun: 'je', answer: "m'appelle" },
        { pronoun: 'tu', answer: "t'appelles" },
        { pronoun: 'il/elle', answer: "s'appelle" },
        { pronoun: 'nous', answer: 'nous appelons' },
        { pronoun: 'vous', answer: 'vous appelez' },
        { pronoun: 'ils/elles', answer: "s'appellent" },
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
  ],
  missionPrompts: [
    {
      id: 'm1',
      title: 'Présentez-vous',
      instruction: 'Write 3–4 sentences introducing yourself: name, nationality, age, and how you feel.',
      example: "Bonjour ! Je m'appelle… Je suis… J'ai… ans. Aujourd'hui, je suis en forme.",
      checklist: ['Name (je m\'appelle)', 'Nationality (je suis)', 'Age (j\'ai + ans)', 'Feeling (ça va)'],
    },
    {
      id: 'm2',
      title: 'Présentez quelqu\'un',
      instruction: 'Describe a friend or celebrity using c\'est and their profession.',
      example: "Lui, c'est Omar Sy. Il est français. Il est acteur.",
      checklist: ["C'est + name", 'Il/Elle est + nationality', 'Il/Elle est + profession'],
    },
    {
      id: 'm3',
      title: 'Demandez des informations',
      instruction: 'Write 4 questions you could ask a new classmate.',
      example: "Comment tu t'appelles ? Tu as quel âge ? Quelle est ta nationalité ? Tu parles quelles langues ?",
      checklist: ["Question with s'appeler", 'Question with avoir (âge)', 'Question with quel/quelle'],
    },
    ...unit1MissionsExtra,
  ],
};
