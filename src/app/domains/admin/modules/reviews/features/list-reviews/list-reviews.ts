import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { IActivitiesLookupResponse, IReviewsQuery, IReviewsResponse } from '../../interfaces';

@Component({
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    RouterLink
  ],
  templateUrl: './list-reviews.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ListReviews {
  protected readonly pageSize = 40;
  protected readonly page = signal(1);
  protected readonly activityId = signal('');
  protected readonly displayedColumns = ['reviewer', 'activity', 'submittedAt', 'actions'];

  private readonly query = computed<IReviewsQuery>(() => ({
    page: this.page(),
    limit: this.pageSize,
    activityId: this.activityId()
  }));

  protected readonly reviewsResource = httpResource<IReviewsResponse>(() => {
    const query = this.query();
    const params = new URLSearchParams({ page: String(query.page), limit: String(query.limit) });
    if (query.activityId) params.set('activityId', query.activityId);
    return `/reviews/staff?${params.toString()}`;
  });
  protected readonly activitiesResource = httpResource<IActivitiesLookupResponse>(() => '/activities/staff?take=1000');
  protected readonly reviews = computed(() => (this.reviewsResource.hasValue() ? this.reviewsResource.value()[0] : []));
  protected readonly total = computed(() => (this.reviewsResource.hasValue() ? this.reviewsResource.value()[1] : 0));
  protected readonly activities = computed(() =>
    this.activitiesResource.hasValue() ? this.activitiesResource.value()[0] : []
  );

  protected onActivityChange(activityId: string): void {
    this.activityId.set(activityId);
    this.page.set(1);
  }

  protected onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }
}
