import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@/app/domains/auth/data-access';
import { ReturnUrl } from '@/app/core/return-url';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const returnUrl = inject(ReturnUrl);

  if (authStore.isUser()) return true;

  returnUrl.saveAttemptedUrl(router.url);
  return router.parseUrl('/auth/sign-in');
};
