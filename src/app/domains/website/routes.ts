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
      { path: '**', redirectTo: '' }
    ]
  }
];

export default routes;
