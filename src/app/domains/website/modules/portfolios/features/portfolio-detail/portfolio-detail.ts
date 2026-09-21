import { httpResource } from '@angular/common/http';
import { Component, computed, effect, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import type { IPortfolio } from '@/app/shared/interfaces';
import { ProgramCard } from '@/app/domains/website/shared/ui';
import { environment } from '@/environments/environment';
import type { IPortfolioProgramsResponse } from '../../interfaces';

@Component({
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatPaginatorModule, ProgramCard, RouterLink],
  templateUrl: './portfolio-detail.html'
})
export default class PortfolioDetail {
  readonly slug = input.required<string>();

  protected readonly pageSize = 12;
  protected readonly page = signal(1);
  protected readonly skeletons = Array.from({ length: 6 }, (_, index) => index);

  protected readonly portfolioResource = httpResource<IPortfolio>(() => {
    const slug = this.slug().trim();
    return slug ? `/portfolios/slug/${encodeURIComponent(slug)}` : undefined;
  });

  protected readonly programsResource = httpResource<IPortfolioProgramsResponse>(() => {
    const slug = this.slug().trim();
    if (!slug) return undefined;
    const params = new URLSearchParams({
      page: String(this.page()),
      limit: String(this.pageSize),
      take: String(this.pageSize)
    });
    return `/programs/portfolio/${encodeURIComponent(slug)}?${params.toString()}`;
  });

  protected readonly programs = computed(() =>
    this.programsResource.hasValue() ? this.programsResource.value()[0] : []
  );
  protected readonly programsCount = computed(() =>
    this.programsResource.hasValue() ? this.programsResource.value()[1] : 0
  );

  protected readonly logoUrl = computed(() => {
    if (!this.portfolioResource.hasValue()) return '';
    const logo = this.portfolioResource.value().logo;
    return logo ? `${environment.apiUrl}/uploads/portfolios/${encodeURIComponent(logo)}` : '';
  });

  constructor() {
    effect(() => {
      this.slug();
      this.page.set(1);
    });
  }

  protected onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }
}
