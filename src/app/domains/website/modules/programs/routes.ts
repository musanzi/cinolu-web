import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    title: 'Programmes',
    loadComponent: () => import('./features/programs').then((component) => component.Programs)
  }
];

export default routes;
