import { Routes } from '@angular/router';
import { AdminLayout } from './layout/layout';

const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: '',
        title: 'Admin',
        loadComponent: () => import('./modules/stats/features/stats')
      },
      {
        path: 'users',
        title: 'Users',
        loadComponent: () => import('./modules/users/features/list-users/list-users')
      },
      {
        path: 'roles',
        title: 'Roles',
        loadComponent: () => import('./modules/roles/features/list-roles/list-roles')
      },
      {
        path: 'categories',
        title: 'Categories',
        loadComponent: () => import('./modules/categories/features/list-categories/list-categories')
      },
      {
        path: 'types',
        title: 'Types',
        loadComponent: () => import('./modules/types/features/list-types/list-types')
      },
      {
        path: 'sectors',
        title: 'Sectors',
        loadComponent: () => import('./modules/sectors/features/list-sectors/list-sectors')
      },
      {
        path: 'activities',
        title: 'Activities',
        loadComponent: () => import('./modules/activities/features/list-activities/list-activities')
      },
      {
        path: 'programs',
        title: 'Programs',
        loadComponent: () => import('./modules/programs/features/list-programs')
      },
      {
        path: 'portfolios',
        title: 'Portfolios',
        loadComponent: () => import('./modules/portfolios/features/list-portfolios/list-portfolios')
      },
      {
        path: 'ventures',
        title: 'Ventures',
        loadComponent: () => import('./modules/ventures/features/list-ventures/list-ventures')
      },
      {
        path: 'profile',
        title: 'My profile',
        loadComponent: () => import('../common/modules/profile/features/profile/profile')
      }
    ]
  }
];

export default routes;
