import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'À propos',
    data: { hasHero: true },
    loadComponent: () => import('./features/about').then((component) => component.AboutUs)
  }
];

export default routes;
