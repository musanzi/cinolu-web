import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@/app/domains/auth/data-access';
import { ReturnUrl } from '@/app/core/return-url';

export const unauthGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const returnUrl = inject(ReturnUrl);

  if (authStore.isAdmin()) {
    return router.parseUrl(returnUrl.pop() ?? '/admin');
  }

  if (authStore.isUser()) {
    return router.parseUrl(returnUrl.pop() ?? '/user');
  }

  return true;
};
