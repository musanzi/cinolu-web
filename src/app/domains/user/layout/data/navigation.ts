import { INavigationItem } from '@/app/shared/ui/navigation/interfaces';

export const NAVIGATION: INavigationItem[] = [
  {
    id: 'account',
    label: 'My account',
    description: 'Manage your personal information',
    children: [
      {
        id: 'profile',
        label: 'Mon profil',
        icon: 'user-round',
        route: '/user/profile',
        activeOptions: { exact: true }
      }
    ]
  },
  {
    id: 'activity',
    label: 'Mon activité',
    description: 'Suivre mes participations et mes projets',
    children: [
      {
        id: 'participations',
        label: 'Mes participations',
        icon: 'clipboard-list',
        route: '/user/participations',
        activeOptions: { exact: false }
      },
      {
        id: 'ventures',
        label: 'Mes projets',
        icon: 'building-2',
        route: '/user/ventures',
        activeOptions: { exact: false }
      }
    ]
  }
];
