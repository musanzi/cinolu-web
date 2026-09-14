import { Routes } from '@angular/router';
import { UserLayout } from './layout/layout';

const routes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile'
      },
      {
        path: 'profile',
        title: 'My profile',
        loadComponent: () => import('../common/modules/profile/features/profile/profile')
      },
      {
        path: 'participations',
        title: 'Mes participations',
        loadComponent: () => import('./modules/participations/features/list-participations/list-participations')
      },
      {
        path: 'participations/:id',
        title: 'Détail de ma participation',
        loadComponent: () => import('./modules/participations/features/participation-detail/participation-detail')
      },
      {
        path: 'ventures',
        title: 'Mes projets',
        loadComponent: () => import('./modules/ventures/features/list-ventures/list-ventures')
      },
      {
        path: 'ventures/:id',
        title: 'Détail de mon projet',
        loadComponent: () => import('./modules/ventures/features/venture-detail/venture-detail')
      }
    ]
  }
];

export default routes;
