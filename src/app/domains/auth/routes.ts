import { Routes } from '@angular/router';
import { AuthLayout } from './layout/layout';

const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'sign-in',
        title: 'Connexion',
        data: {
          authContent: {
            asideTitle: 'Heureux de vous revoir',
            asideDescription: 'Connectez-vous pour retrouver vos programmes, activités et projets sur Cinolu OneStop.',
            asideFootnote: 'Votre espace membre vous attend.'
          }
        },
        loadComponent: () => import('./features/sign-in/sign-in').then((c) => c.AuthSignIn)
      },
      {
        path: 'sign-up',
        title: 'Inscription',
        data: {
          authContent: {
            asideTitle: "Rejoignez l'écosystème Cinolu",
            asideDescription:
              'Créez votre compte et accédez aux programmes, opportunités et activités de la communauté.',
            asideFootnote: "L'innovation commence par une connexion."
          }
        },
        loadComponent: () => import('./features/sign-up/sign-up').then((c) => c.AuthSignUp)
      },
      {
        path: 'forgot-password',
        title: 'Mot de passe oublié',
        data: {
          authContent: {
            asideTitle: 'Récupérez votre accès',
            asideDescription: 'Recevez un lien sécurisé pour définir un nouveau mot de passe.',
            asideFootnote: 'Vous pourrez reprendre votre parcours en quelques instants.'
          }
        },
        loadComponent: () => import('./features/forgot-password/forgot-password').then((c) => c.AuthForgotPassword)
      },
      {
        path: 'forgot-password-sent',
        title: 'Lien de réinitialisation envoyé',
        data: {
          authContent: {
            asideTitle: 'Consultez votre boîte mail',
            asideDescription: 'Ouvrez le lien envoyé à votre adresse avant son expiration.',
            asideFootnote: 'Le lien reste valable pendant 15 minutes.'
          }
        },
        loadComponent: () =>
          import('./features/forgot-password-sent/forgot-password-sent').then((c) => c.AuthForgotPasswordSent)
      },
      {
        path: 'reset-password',
        title: 'Réinitialiser le mot de passe',
        data: {
          authContent: {
            asideTitle: 'Sécurisez votre compte',
            asideDescription: 'Choisissez un nouveau mot de passe pour terminer la récupération.',
            asideFootnote: 'Utilisez un mot de passe unique et difficile à deviner.'
          }
        },
        loadComponent: () => import('./features/reset-password/reset-password').then((c) => c.AuthResetPassword)
      }
    ]
  }
];

export default routes;
