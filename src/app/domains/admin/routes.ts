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
        path: 'users/:email',
        title: 'User details',
        loadComponent: () => import('./modules/users/features/user-details/user-details')
      },
      {
        path: 'roles',
        title: 'Roles',
        loadComponent: () => import('./modules/roles/features/list-roles/list-roles')
      },
      {
        path: 'activities',
        title: 'Activities',
        loadComponent: () => import('./modules/activities/features/list-activities')
      },
      {
        path: 'activities/:slug',
        title: 'Activity details',
        loadComponent: () => import('./modules/activities/features/activity-details')
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
        path: 'categories',
        title: 'Categories',
        data: {
          config: {
            endpoint: '/categories',
            singular: 'category',
            plural: 'Categories',
            description: 'Categories used to organise activities.'
          }
        },
        loadComponent: () => import('./modules/reference-data/features/list-reference-data/list-reference-data')
      },
      {
        path: 'types',
        title: 'Types',
        data: {
          config: {
            endpoint: '/types',
            singular: 'type',
            plural: 'Types',
            description: 'Types used to classify activities.'
          }
        },
        loadComponent: () => import('./modules/reference-data/features/list-reference-data/list-reference-data')
      },
      {
        path: 'sectors',
        title: 'Sectors',
        data: {
          config: {
            endpoint: '/sectors',
            singular: 'sector',
            plural: 'Sectors',
            description: 'Sectors available to ventures.'
          }
        },
        loadComponent: () => import('./modules/reference-data/features/list-reference-data/list-reference-data')
      },
      {
        path: 'reviews',
        title: 'Reviews',
        loadComponent: () => import('./modules/reviews/features/list-reviews/list-reviews')
      },
      {
        path: 'reviews/:id',
        title: 'Review details',
        loadComponent: () => import('./modules/reviews/features/review-details/review-details')
      },
      {
        path: 'ventures',
        title: 'Ventures',
        loadComponent: () => import('./modules/ventures/features/list-ventures/list-ventures')
      },
      {
        path: 'ventures/:id',
        title: 'Venture details',
        loadComponent: () => import('./modules/ventures/features/venture-details/venture-details')
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
