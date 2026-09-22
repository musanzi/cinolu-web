import { httpResource } from '@angular/common/http';
import { Component, computed, debounced, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { ActivityCard } from '@/app/domains/website/shared/ui';
import { ActivitiesHero } from '../../ui/hero/hero';
import { IActivitiesQuery, IActivitiesResponse, IProgramsResponse } from '../../interfaces';

@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    ActivityCard,
    ActivitiesHero
  ],
  templateUrl: './list-activities.html'
})
export default class Activities {
  private readonly route = inject(ActivatedRoute);
  private readonly initialQueryParams = this.route.snapshot.queryParamMap;
  protected readonly pageSize = 9;
  protected readonly page = signal(1);
  protected readonly q = signal('');
  protected readonly startDate = signal<Date | null>(null);
  protected readonly endDate = signal<Date | null>(null);
  protected readonly programId = signal(this.initialQueryParams.get('programId') ?? '');
  protected readonly skeletons = Array.from({ length: this.pageSize }, (_, index) => index);
  private readonly debouncedQuery = debounced(this.q, 300);

  private readonly query = computed<IActivitiesQuery>(() => ({
    q: this.debouncedQuery.value().trim(),
    page: String(this.page()),
    startDate: this.toApiDate(this.startDate(), false),
    endDate: this.toApiDate(this.endDate(), true),
    limit: String(this.pageSize),
    take: String(this.pageSize),
    programId: this.programId()
  }));

  protected readonly activitiesResource = httpResource<IActivitiesResponse>(() => {
    const query = this.query();
    const params = new URLSearchParams({
      page: query.page,
      limit: query.limit,
      take: query.take
    });

    if (query.q) params.set('q', query.q);
    if (query.startDate) params.set('startDate', query.startDate);
    if (query.endDate) params.set('endDate', query.endDate);
    if (query.programId) params.set('programId', query.programId);

    return `/activities?${params.toString()}`;
  });

  protected readonly programsResource = httpResource<IProgramsResponse>(() => '/programs?take=100');
  protected readonly activities = computed(() =>
    this.activitiesResource.hasValue() ? this.activitiesResource.value()[0] : []
  );
  protected readonly activitiesCount = computed(() =>
    this.activitiesResource.hasValue() ? this.activitiesResource.value()[1] : 0
  );
  protected readonly programs = computed(() =>
    this.programsResource.hasValue() ? this.programsResource.value()[0] : []
  );
  protected readonly hasActiveFilters = computed(
    () =>
      this.q().trim().length > 0 || this.programId().length > 0 || this.startDate() !== null || this.endDate() !== null
  );

  protected onSearchChange(value: string): void {
    this.page.set(1);
    this.q.set(value);
  }

  protected onProgramChange(value: string): void {
    this.page.set(1);
    this.programId.set(value);
  }

  protected onStartDateChange(value: Date | null): void {
    this.page.set(1);
    this.startDate.set(value);
  }

  protected onEndDateChange(value: Date | null): void {
    this.page.set(1);
    this.endDate.set(value);
  }

  protected onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }

  protected clearFilters(): void {
    this.page.set(1);
    this.q.set('');
    this.startDate.set(null);
    this.endDate.set(null);
    this.programId.set('');
  }

  private toApiDate(value: Date | null, endOfDay: boolean): string {
    if (!value) return '';

    const date = new Date(value);
    if (endOfDay) date.setHours(23, 59, 59, 999);
    else date.setHours(0, 0, 0, 0);
    return date.toISOString();
  }
}
