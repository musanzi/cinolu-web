import { IHistoryItem } from '../interfaces';

export const HISTORY_TIMELINE: readonly IHistoryItem[] = [
  {
    id: 1,
    status: 'Lancement',
    date: '2015',
    icon: 'flag',
    description: 'Lancement du Cinolu, 1er hub d’innovation à Lubumbashi'
  },
  {
    id: 2,
    status: 'Programmes',
    date: '2017–2020',
    icon: 'users',
    description: 'Mise en œuvre de programmes genre & jeunesse (F360, civic tech…)'
  },
  {
    id: 3,
    status: 'Incubateur',
    date: '2021',
    icon: 'briefcase',
    description: 'Déploiement de l’incubateur Ushindi et de cohortes entrepreneuriales'
  },
  {
    id: 4,
    status: 'Expansion',
    date: '2023–2024',
    icon: 'globe',
    description: 'Déploiement régional (SOPA+, Afrilabs, Fikiri…) et création du Cinolu OneStop'
  },
  {
    id: 5,
    status: 'Structuration',
    date: '2025',
    icon: 'settings',
    description: 'Structuration numérique complète de l’accompagnement et de l’impact'
  }
];
