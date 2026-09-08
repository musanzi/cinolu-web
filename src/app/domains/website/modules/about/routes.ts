import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'À propos',
    loadComponent: () => import('./features/about').then((component) => component.AboutUs)
  }
];

export default routes;
