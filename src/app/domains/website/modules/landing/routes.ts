import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    title: 'Accueil',
    data: { hasHero: true },
    loadComponent: () => import('./features/landing').then((component) => component.Landing)
  }
];

export default routes;
