import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: ':slug',
    title: 'Portefeuille',
    loadComponent: () => import('./features/portfolio-detail/portfolio-detail')
  }
];
export default routes;
