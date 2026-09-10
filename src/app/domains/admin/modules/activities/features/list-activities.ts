import { httpResource } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, debounced, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { IActivitiesQuery, IActivitiesResponse } from '../interfaces';

@Component({
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    RouterLink
  ],
  templateUrl: './list-activities.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ListActivities {
  protected readonly pageSize = 12;
  protected readonly page = signal(1);
  protected readonly q = signal('');
  protected readonly startDate = signal<Date | null>(null);
  protected readonly endDate = signal<Date | null>(null);
  private readonly debouncedQuery = debounced(this.q, 300);

  private readonly query = computed<IActivitiesQuery>(() => ({
    page: this.page(),
    limit: this.pageSize,
    ...(this.debouncedQuery.value().trim() && { q: this.debouncedQuery.value().trim() }),
    ...(this.startDate() && { startDate: this.startDate()!.toISOString() }),
    ...(this.endDate() && { endDate: this.endDate()!.toISOString() })
  }));

  protected readonly activitiesResource = httpResource<IActivitiesResponse>(() => {
    const query = this.query();
    const params = new URLSearchParams({ page: query.page.toString(), limit: query.limit.toString() });

    if (query.q) params.set('q', query.q);
    if (query.startDate) params.set('startDate', query.startDate);
    if (query.endDate) params.set('endDate', query.endDate);

    return `/activities?${params.toString()}`;
  });

  protected readonly recentResource = httpResource<IActivitiesResponse[0]>(() => '/activities/recent');
  protected readonly activities = computed(() => this.activitiesResource.value()?.[0] ?? []);
  protected readonly total = computed(() => this.activitiesResource.value()?.[1] ?? 0);

  protected onSearch(value: string): void {
    this.q.set(value);
    this.page.set(1);
  }

  protected onStartDateChange(value: Date | null): void {
    this.startDate.set(value);
    this.page.set(1);
  }

  protected onEndDateChange(value: Date | null): void {
    this.endDate.set(value);
    this.page.set(1);
  }

  protected onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }

  protected clearFilters(): void {
    this.q.set('');
    this.startDate.set(null);
    this.endDate.set(null);
    this.page.set(1);
  }
}
