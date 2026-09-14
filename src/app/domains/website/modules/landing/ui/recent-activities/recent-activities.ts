import { httpResource } from '@angular/common/http';
import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { IActivity } from '@/app/shared/interfaces';
import { ActivityCard } from '@/app/domains/website/shared/ui';

@Component({
  selector: 'landing-recent-activities',
  imports: [ActivityCard, MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './recent-activities.html',
  host: { class: 'block' }
})
export class LandingRecentActivities {
  protected readonly activitiesResource = httpResource<IActivity[]>(() => '/activities/recent');
  protected readonly carousel = viewChild<ElementRef<HTMLDivElement>>('carousel');
  protected readonly canMovePrevious = signal(false);
  protected readonly canMoveNext = signal(true);
  protected readonly skeletons = [0, 1, 2];

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
