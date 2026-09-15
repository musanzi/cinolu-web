import { httpResource } from '@angular/common/http';
import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioCard } from '@/app/domains/website/shared/ui';
import { IPortfoliosResponse } from '../../interfaces';

@Component({
  selector: 'landing-portfolios',
  imports: [PortfolioCard, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './portfolios.html',
  host: { class: 'block' }
})
export class LandingPortfolios {
  protected readonly portfoliosResource = httpResource<IPortfoliosResponse>(() => '/portfolios');
  protected readonly carousel = viewChild<ElementRef<HTMLDivElement>>('carousel');
  protected readonly canMovePrevious = signal(false);
  protected readonly canMoveNext = signal(true);
  protected readonly skeletons = [0, 1, 2, 3];

  protected moveCarousel(forward: boolean): void {
    const carousel = this.carousel()?.nativeElement;
    const card = carousel?.querySelector<HTMLElement>('.carousel-item');

    if (!carousel || !card) return;

    const gap = Number.parseFloat(getComputedStyle(carousel).columnGap) || 0;
    carousel.scrollBy({ left: (card.offsetWidth + gap) * (forward ? 1 : -1), behavior: 'smooth' });
  }

  protected updateControls(): void {
    const carousel = this.carousel()?.nativeElement;
    if (!carousel) return;

    const remainingScroll = carousel.scrollWidth - carousel.clientWidth - carousel.scrollLeft;
    this.canMovePrevious.set(carousel.scrollLeft > 2);
    this.canMoveNext.set(remainingScroll > 2);
  }
}
