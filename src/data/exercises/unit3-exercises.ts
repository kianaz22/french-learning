import type { MissionPrompt } from '../types';

export { unit3Quiz } from './unit3-quiz';
export { unit3Fill } from './unit3-fill';

export const unit3MissionsExtra: MissionPrompt[] = [
  {
    id: 'm9',
    title: 'Météo du week-end',
    instruction:
      'Write 5 sentences about this weekend’s weather and what you are going to do. Use il fait / il pleut / il y a and futur proche.',
    example:
      "Samedi, il fait beau. Il y a du soleil. Je vais aller à la plage. Dimanche, il pleut. Nous allons rester à l'hôtel.",
    checklist: ['Il fait + adjective', 'Il y a du… / il pleut', 'Futur proche (2+)', 'Weekend day'],
  },
  {
    id: 'm10',
    title: 'Quatre saisons',
    instruction:
      'Describe the weather in each season in France (or your country). Use en été, en hiver, au printemps, en automne.',
    example:
      "Au printemps, il fait doux. En été, il fait chaud et il y a du soleil. En automne, il pleut souvent. En hiver, il fait froid et parfois il neige.",
    checklist: ['au printemps', 'en été', 'en automne', 'en hiver'],
  },
  {
    id: 'm11',
    title: 'Projets d’été',
    instruction:
      'Write 6 sentences about summer plans with aller + infinitive. Include a city, transport, and one weather sentence.',
    example:
      "Cet été, je vais voyager à Nice. Je vais prendre le train. Nous allons visiter la plage. Il fait chaud en juillet. Je vais nager. Mes amis vont venir aussi.",
    checklist: ['cet été', 'Futur proche (3+)', 'Transport', 'Météo'],
  },
  {
    id: 'm12',
    title: 'Itinéraire',
    instruction:
      'Give directions from the gare to the plage, then to the marché. Use tout droit, à gauche/droite, près de / loin de.',
    example:
      "De la gare, allez tout droit. Tournez à droite après le pont. La plage est près du centre-ville. Ensuite, tournez à gauche. Le marché est loin de la plage.",
    checklist: ['tout droit', 'à gauche or à droite', 'près de', 'loin de'],
  },
  {
    id: 'm13',
    title: 'Ce que je vois',
    instruction:
      'Walk down a street in writing. Use ce / cet / cette / ces with at least four different nouns (places or things you see).',
    example:
      "Ce pont est ancien. Cet hôtel est près de la gare. Cette rue est animée. Ces restaurants sont super. J'aime cette place.",
    checklist: ['ce + masc.', 'cet + vowel', 'cette + fem.', 'ces + plural'],
  },
  {
    id: 'm14',
    title: 'D’où venez-vous ?',
    instruction:
      'Write a short dialogue (6 lines) asking where people come from and how they travel. Use venir and prendre.',
    example:
      "— Tu viens d'où ? — Je viens de Lyon. — Vous venez en train ? — Oui, nous prenons le train. — Et tes amis ? — Ils viennent de Paris en bus.",
    checklist: ['venir (2+ forms)', 'prendre', 'Question + answer', 'Transport'],
  },
  {
    id: 'm15',
    title: 'Transports en ville',
    instruction:
      'Explain how you get to 4 places (gare, marché, plage, hôtel) using à pied, en bus, en métro, en taxi.',
    example:
      "Je vais à la gare en métro. Le marché est près d'ici : j'y vais à pied. Pour la plage, je prends le bus. L'hôtel est loin : on prend un taxi.",
    checklist: ['à pied', 'en bus or en métro', 'prendre', 'près de / loin de'],
  },
  {
    id: 'm16',
    title: 'Près ou loin',
    instruction:
      'Locate 5 city places with près du / près de la / loin du / loin de la / près de l’. Use correct contractions.',
    example:
      "Le café est près du parc. La plage est loin de la gare. L'hôtel est près de l'église. Le musée est loin du port. Nous habitons près des magasins.",
    checklist: ['près du', 'près de la or loin de la', 'de l\'', 'des (optional)'],
  },
  {
    id: 'm17',
    title: 'Week-end à Nice',
    instruction:
      'Write a 6-sentence weekend in Nice: weather, one direction, transport, and two futur proche plans.',
    example:
      "Cet été, nous allons à Nice. Il fait beau et il y a du soleil. Nous prenons le train. L'hôtel est près de la gare. Samedi, je vais visiter le marché. Dimanche, on va à la plage à pied.",
    checklist: ['City + weather', 'Transport', 'près de / loin de', 'Futur proche (2+)'],
  },
  {
    id: 'm18',
    title: 'Perdu en ville',
    instruction:
      'Write a 6–8 line dialogue: you are lost and ask a passer-by for the musée. Include Excusez-moi, Où est, and two directions.',
    example:
      "— Excusez-moi, où est le musée ? — Allez tout droit, puis tournez à gauche. — C'est près de la mairie ? — Oui, c'est en face du parc. — On y va à pied ? — Oui, c'est pas loin. — Merci !",
    checklist: ['Excusez-moi / Où est', 'tout droit', 'à gauche or à droite', 'près de / en face de'],
  },
  {
    id: 'm19',
    title: 'Une journée en ville',
    instruction:
      'Plan a day with morning / afternoon / evening. Use futur proche, two transports, and one weather sentence.',
    example:
      "Ce matin, il fait beau. Je vais prendre le métro. Cet après-midi, nous allons visiter ce musée. On y va à pied. Le soir, je vais dîner près de la place. Il va faire doux.",
    checklist: ['Time of day (2+)', 'Futur proche (3+)', 'Two transports', 'Météo'],
  },
  {
    id: 'm20',
    title: 'Carte postale',
    instruction:
      'Write a postcard (6–8 sentences) from a French city: weather, season, places with demonstratives, and how you get around.',
    example:
      "Salut ! Je suis à Marseille cet été. Il fait chaud et il y a du soleil. Cette ville est super. Ce port est magnifique. Nous prenons le bus ou nous allons à pied. Cet hôtel est près de la plage. Demain, je vais visiter le marché. À bientôt !",
    checklist: ['Greeting + city', 'Weather / season', 'ce/cet/cette', 'Transport + plan'],
  },
];
