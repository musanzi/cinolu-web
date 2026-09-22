import { Service, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { LocalStorage } from '@/app/core/local-storage';

export const AUTH_RETURN_URL_KEY = 'auth_return_url';

@Service()
export class ReturnUrl {
  private router = inject(Router);
  private localStorage = inject(LocalStorage);
  private currentUrl: string | null = null;
  private previousUrl: string | null = null;

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  saveAttemptedUrl(url: string): void {
    this.localStorage.setItem(AUTH_RETURN_URL_KEY, url);
  }

  peek(): string | null {
    return this.localStorage.getItem(AUTH_RETURN_URL_KEY);
  }

  saveOriginIfMissing(): void {
    if (this.localStorage.getItem(AUTH_RETURN_URL_KEY) || !this.previousUrl) return;
    if (this.previousUrl.startsWith('/auth')) return;

    this.saveAttemptedUrl(this.previousUrl);
  }

  pop(): string | null {
    const url = this.localStorage.getItem(AUTH_RETURN_URL_KEY);
    if (url !== null) {
      this.localStorage.removeItem(AUTH_RETURN_URL_KEY);
    }

    return url;
  }

  clear(): void {
    this.localStorage.removeItem(AUTH_RETURN_URL_KEY);
  }
}
