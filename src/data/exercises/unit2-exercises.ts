import type { MissionPrompt } from '../types';

export { unit2Quiz } from './unit2-quiz';
export { unit2Fill } from './unit2-fill';

export const unit2MissionsExtra: MissionPrompt[] = [
  {
    id: 'm9',
    title: 'Le programme du week-end',
    instruction: 'Write your Saturday and Sunday plans. Use aller + place, faire + sport, and at least two times of day.',
    example: "Samedi matin, je fais du vélo. L'après-midi, je vais au musée. Dimanche soir, on va au restaurant à 20h.",
    checklist: ['Samedi / dimanche', 'aller au / à la', 'faire du / de la', 'Time of day'],
  },
  {
    id: 'm10',
    title: 'Invitez un ami au sport',
    instruction: 'Write a short message inviting a friend to do a sport. Include the activity, the place, and the time.',
    example: "Salut ! Tu es libre samedi ? On fait du tennis à la piscine… non, au parc, à 10h ? Ça te dit ?",
    checklist: ['Tu es libre / Ça te dit', 'faire du / de la', 'Place + time', 'Question'],
  },
  {
    id: 'm11',
    title: 'Il y a quoi dans la pièce ?',
    instruction: 'Describe a room with il y a. Name at least 6 objects using un/une/des and one c\'est / ce sont sentence.',
    example: "Dans ma chambre, il y a une table, un ordinateur et des livres. C'est mon sac. Ce sont mes chaussures.",
    checklist: ['Il y a', 'un/une/des', "C'est / ce sont", 'At least 6 objects'],
  },
  {
    id: 'm12',
    title: 'Les goûts de la famille',
    instruction: 'Write about what three family members like. Use possessives (mon, ma, son, sa, leurs) and aimer / adorer / détester.',
    example: "Mon frère adore le football. Sa valise est toujours prête pour le stade. Ma sœur déteste le vélo. Leurs goûts sont différents.",
    checklist: ['3 people', 'Possessives', 'aimer / adorer / détester', '4+ sentences'],
  },
  {
    id: 'm13',
    title: 'Un samedi minute par minute',
    instruction: 'Plan a Saturday with four time slots. Use à + hour, aller, and faire.',
    example: "À 9h, je fais de la natation. À 13h, on va au restaurant. À 16h, je vais au parc. À 20h, on va au cinéma.",
    checklist: ['À + hour (4 times)', 'aller', 'faire', 'On or je'],
  },
  {
    id: 'm14',
    title: 'Oui ou non',
    instruction: 'Write a 6-line dialogue: one person invites, the other refuses once, then they agree on a new plan.',
    example: "— On va au concert samedi ? — Désolé, je ne peux pas. — Dimanche alors ? On va au parc ? — D'accord ! Super, à dimanche !",
    checklist: ['Invitation with on', 'Désolé / je ne peux pas', "D'accord / Super", 'New place or day'],
  },
  {
    id: 'm15',
    title: 'Sports et lieux',
    instruction: 'Write 5 sentences contrasting sports you do (faire du / de la) and places you go (aller au / à la / à l\').',
    example: "Je fais du tennis, mais je vais à la piscine le vendredi. J'adore le vélo. Le dimanche, on va au stade. Je ne fais pas de ski.",
    checklist: ['faire du / de la', 'aller au / à la', 'Negation (ne … pas)', '5 sentences'],
  },
  {
    id: 'm16',
    title: 'La valise du week-end',
    instruction: 'Pack for a weekend trip. List objects with un/une/des and say whose they are (mon, ma, mes, ton, ta).',
    example: "Dans ma valise, il y a un pull, une trousse et des chaussures. Mon manteau est lourd. Tes clés sont sur la table.",
    checklist: ['Il y a', 'un/une/des', 'mon/ma/mes', 'At least one ton/ta/tes'],
  },
  {
    id: 'm17',
    title: 'On fait quoi ?',
    instruction: 'Write 6 sentences using on (not nous) to plan a weekend with friends: places, sports, and opinions.',
    example: "On va au café samedi matin. On fait du vélo l'après-midi. On adore le parc. On déteste attendre. On se retrouve à 11h. C'est super !",
    checklist: ['On + verb (6 times)', 'aller or faire', 'adorer / détester', "C'est super / nul"],
  },
  {
    id: 'm18',
    title: 'Sortie au musée',
    instruction: 'Write a dialogue about going to a museum or the cinema. Include time, meeting place, and one preference.',
    example: "— Tu veux aller au musée dimanche ? — Oui ! À quelle heure ? — À 15h, au café près du musée. — Parfait, je préfère l'après-midi.",
    checklist: ['aller au / à la', 'À quelle heure', 'On se retrouve / place', 'Je préfère'],
  },
  {
    id: 'm19',
    title: 'Semaine et week-end',
    instruction: 'Contrast a weekday and the weekend in 6 sentences: work/school vs outings, sports, and rest.',
    example: "Le matin, je vais à l'école. Le week-end, je me repose. Samedi, on va au marché. Dimanche, je fais de la randonnée. J'adore le dimanche. C'est super !",
    checklist: ['Weekday vs week-end', 'aller', 'faire', 'se reposer or sortir'],
  },
  {
    id: 'm20',
    title: 'Message pour sortir',
    instruction: 'Write a text message (5–7 sentences) making weekend plans: invite, suggest two options, give a time, and close.',
    example: "Salut ! Tu fais quoi ce week-end ? On va au cinéma ou on fait du vélo ? Il y a un concert samedi aussi. On se retrouve à 18h au café ? À tout à l'heure !",
    checklist: ['On va / Tu fais quoi', 'Two options', 'Il y a', 'Time + place'],
  },
];
