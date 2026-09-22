import { httpResource } from '@angular/common/http';
import { Component, computed, debounced, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { ProgramCard } from '@/app/domains/website/shared/ui';
import { IProgramsQuery, IProgramsResponse, IPortfoliosResponse } from '../../interfaces';
import { ProgramsHero } from '../../ui/hero/hero';

@Component({
  selector: 'website-programs',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    ProgramCard,
    ProgramsHero
  ],
  templateUrl: './list-programs.html'
})
export default class ListPrograms {
  private readonly route = inject(ActivatedRoute);
  private readonly initialQueryParams = this.route.snapshot.queryParamMap;
  protected readonly pageSize = 9;
  protected readonly page = signal(1);
  protected readonly q = signal('');
  protected readonly portfolioId = signal(this.initialQueryParams.get('portfolioId') ?? '');
  protected readonly debouncedQuery = debounced(this.q, 300);
  protected readonly skeletons = Array.from({ length: this.pageSize }, (_, index) => index);

  private readonly query = computed<IProgramsQuery>(() => ({
    q: this.debouncedQuery.value().trim(),
    portfolioId: this.portfolioId(),
    page: String(this.page()),
    limit: String(this.pageSize),
    take: String(this.pageSize)
  }));

  protected readonly programsResource = httpResource<IProgramsResponse>(() => {
    const query = this.query();
    const params = new URLSearchParams({
      page: query.page,
      limit: query.limit,
      take: query.take
    });

    if (query.q) params.set('q', query.q);
    if (query.portfolioId) params.set('portfolioId', query.portfolioId);

    return `/programs?${params.toString()}`;
  });

  protected readonly portfoliosResource = httpResource<IPortfoliosResponse>(() => '/portfolios');
  protected readonly programs = computed(() =>
    this.programsResource.hasValue() ? this.programsResource.value()[0] : []
  );
  protected readonly programsCount = computed(() =>
    this.programsResource.hasValue() ? this.programsResource.value()[1] : 0
  );
  protected readonly portfolios = computed(() =>
    this.portfoliosResource.hasValue() ? this.portfoliosResource.value()[0] : []
  );
  protected readonly hasActiveFilters = computed(() => this.q().trim().length > 0 || this.portfolioId().length > 0);

  protected onSearchChange(value: string): void {
    this.page.set(1);
    this.q.set(value);
  }

  protected onPortfolioChange(value: string): void {
    this.page.set(1);
    this.portfolioId.set(value);
  }

  protected onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }

  protected clearFilters(): void {
    this.page.set(1);
    this.q.set('');
    this.portfolioId.set('');
  }
}
