import { httpResource } from '@angular/common/http';
import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { IProgram } from '@/app/shared/interfaces';
import { ProgramCard } from '@/app/domains/website/shared/ui';

@Component({
  selector: 'landing-recent-programs',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink, ProgramCard],
  templateUrl: './recent-programs.html',
  host: { class: 'block' }
})
export class LandingRecentPrograms {
  protected readonly programsResource = httpResource<IProgram[]>(() => '/programs/recent');
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
