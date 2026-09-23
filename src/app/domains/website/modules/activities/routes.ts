import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    title: 'Activités',
    data: { hasHero: true },
    loadComponent: () => import('./features/list-activities/list-activities')
  },
  {
    path: ':slug',
    title: "Détail de l'activité",
    loadComponent: () => import('./features/activity-detail/activity-detail')
  }
];

export default routes;
