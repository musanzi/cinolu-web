import { Routes } from '@angular/router';
import { WebLayout } from '@/app/domains/website/layout/layout';

const routes: Routes = [
  {
    path: '',
    component: WebLayout,
    children: [
      {
        path: '',
        title: 'Accueil',
        loadChildren: () => import('./modules/landing/routes')
      },
      {
        path: 'about',
        title: 'A propos',
        loadChildren: () => import('./modules/about/routes')
      },
      {
        path: 'programs',
        title: 'Programmes',
        loadChildren: () => import('./modules/programs/routes')
      },
      {
        path: 'activities',
        title: 'Activités',
        loadChildren: () => import('./modules/activities/routes')
      },
      {
        path: 'portfolios',
        title: 'Portefeuilles',
        loadChildren: () => import('./modules/portfolios/routes')
      },
      { path: '**', redirectTo: '' }
    ]
  }
];

export default routes;
