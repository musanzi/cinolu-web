import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    title: 'Programmes',
    data: { hasHero: true },
    loadComponent: () => import('./features/list-programs/list-programs')
  },
  {
    path: ':slug',
    title: 'Programme',
    loadComponent: () => import('./features/program-detail/program-detail')
  }
];

export default routes;
