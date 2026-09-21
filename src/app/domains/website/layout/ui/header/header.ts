import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { AuthStore } from '@/app/domains/auth/data-access';
import { NAVIGATION_LINKS } from '../../data/navigation';

@Component({
  selector: 'website-header',
  imports: [MatButtonModule, MatIcon, RouterLink, RouterLinkActive],
  host: {
    '(window:scroll)': 'updateScrolledState()'
  },
  templateUrl: './header.html'
})
export class WebsiteHeader {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly authStore = inject(AuthStore);
  protected isScrolled = signal(false);
  protected isMenuOpen = signal(false);

  private readonly navigationEnd = toSignal(
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)),
    { initialValue: undefined }
  );

  protected links = NAVIGATION_LINKS;
  protected readonly hasHero = computed(() => {
    this.navigationEnd();
    let current: ActivatedRoute = this.route.root;
    while (current.firstChild) current = current.firstChild;
    return current.snapshot.data['hasHero'] === true;
  });
  protected readonly solidHeader = computed(() => this.isScrolled() || !this.hasHero());

  protected toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected navLinkClasses(active: boolean): string {
    if (!this.solidHeader()) {
      return active
        ? 'border-white text-primary-200 font-extrabold'
        : 'border-transparent text-white/80 hover:border-white/40 hover:text-primary-200';
    }

    return active
      ? 'border-primary-500 text-primary-600 font-extrabold'
      : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-primary-600';
  }

  protected mobileNavLinkClasses(active: boolean): string {
    return active ? 'bg-primary-50 text-primary-500' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-950';
  }

  protected updateScrolledState(): void {
    this.isScrolled.set(window.scrollY > 0);
  }

  protected signOut(): void {
    this.authStore.signOut();
    this.closeMenu();
  }
}
