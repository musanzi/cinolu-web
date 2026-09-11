import { INavigationItem } from '@/app/shared/ui/navigation/interfaces';

export const NAVIGATION: INavigationItem[] = [
  {
    id: 'overview',
    label: "Vue d'ensemble",
    description: 'Track key metrics',
    children: [
      {
        id: 'stats',
        label: 'Statistiques',
        icon: 'chart-no-axes-combined',
        route: '/admin',
        activeOptions: { exact: true }
      }
    ]
  },
  {
    id: 'content',
    label: 'Content',
    description: 'Manage platform content',
    children: [
      {
        id: 'portfolios',
        label: 'Portfolios',
        icon: 'briefcase-business',
        route: 'portfolios',
        activeOptions: { exact: false }
      },
      {
        id: 'programs',
        label: 'Programs',
        icon: 'blocks',
        route: 'programs',
        activeOptions: { exact: false }
      },
      {
        id: 'activities',
        label: 'Activities',
        icon: 'calendar-days',
        route: '/admin/activities',
        activeOptions: { exact: false }
      },
      {
        id: 'ventures',
        label: 'Ventures',
        icon: 'rocket',
        route: 'ventures',
        activeOptions: { exact: false }
      }
    ]
  },
  {
    id: 'taxonomy',
    label: 'Taxonomy',
    description: 'Manage classifications',
    children: [
      {
        id: 'categories',
        label: 'Categories',
        icon: 'tags',
        route: 'categories',
        activeOptions: { exact: false }
      },
      {
        id: 'types',
        label: 'Types',
        icon: 'shapes',
        route: 'types',
        activeOptions: { exact: false }
      },
      {
        id: 'sectors',
        label: 'Sectors',
        icon: 'layers-2',
        route: 'sectors',
        activeOptions: { exact: false }
      }
    ]
  },
  {
    id: 'users-and-access',
    label: 'Users and access',
    description: 'Manage accounts and permissions',
    children: [
      {
        id: 'users',
        label: 'Users',
        icon: 'users',
        route: 'users',
        activeOptions: { exact: false }
      },
      {
        id: 'roles',
        label: 'Roles',
        icon: 'shield-check',
        route: 'roles',
        activeOptions: { exact: false }
      }
    ]
  }
];
