import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthStore } from '@/app/domains/auth/data-access';
import { NAVIGATION_LINKS } from '../../data/navigation';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatIcon, RouterLink, RouterLinkActive],
  host: {
    '(window:scroll)': 'updateScrolledState()'
  },
  templateUrl: './header.html'
})
export class Header {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  protected isScrolled = signal(false);
  protected isMenuOpen = signal(false);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  protected links = NAVIGATION_LINKS;
  protected solidHeader = computed(() => this.isScrolled() || this.currentUrl().split('#')[0] !== '/');

  protected toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected navLinkClasses(active: boolean): string {
    if (!this.solidHeader()) {
      return active
        ? 'border-white text-white font-extrabold'
        : 'border-transparent text-white/80 hover:border-white/40 hover:text-white';
    }

    return active
      ? 'border-primary-500 text-gray-950 font-extrabold'
      : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-950';
  }

  protected mobileNavLinkClasses(active: boolean): string {
    return active ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-950';
  }

  protected updateScrolledState(): void {
    this.isScrolled.set(window.scrollY > 0);
  }

  protected signOut(): void {
    this.authStore.signOut();
    this.closeMenu();
  }
}
