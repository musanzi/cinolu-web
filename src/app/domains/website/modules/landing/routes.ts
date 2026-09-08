import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    title: 'Accueil',
    loadComponent: () => import('./features/landing').then((component) => component.Landing)
  }
];

export default routes;
