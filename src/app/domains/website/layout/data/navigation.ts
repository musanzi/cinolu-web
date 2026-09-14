import { INavigationLink } from '../interfaces/navigation.interface';

export const NAVIGATION_LINKS: readonly INavigationLink[] = [
  { label: 'Accueil', path: '/', icon: 'house' },
  { label: 'Programmes', path: '/programs', icon: 'blocks' },
  { label: 'Activités', path: '/activities', icon: 'calendar-days' },
  { label: 'Portefeuilles', path: '/', fragment: 'portefeuilles', icon: 'layers' },
  { label: 'À propos', path: '/about', icon: 'info' }
];
