import { httpResource } from '@angular/common/http';
import { Component, computed, effect, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import type { IProgram } from '@/app/shared/interfaces';
import { ActivityCard } from '@/app/domains/website/shared/ui';
import { environment } from '@/environments/environment';
import type { IProgramActivitiesResponse } from '../../interfaces';

@Component({
  selector: 'website-program-detail',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatPaginatorModule, ActivityCard, RouterLink],
  templateUrl: './program-detail.html'
})
export default class ProgramDetail {
  readonly slug = input.required<string>();

  protected readonly pageSize = 12;
  protected readonly page = signal(1);
  protected readonly skeletons = Array.from({ length: 6 }, (_, index) => index);

  protected readonly programResource = httpResource<IProgram>(() => {
    const slug = this.slug().trim();
    return slug ? `/programs/slug/${encodeURIComponent(slug)}` : undefined;
  });

  protected readonly activitiesResource = httpResource<IProgramActivitiesResponse>(() => {
    const slug = this.slug().trim();
    if (!slug) return undefined;
    const params = new URLSearchParams({
      page: String(this.page()),
      limit: String(this.pageSize),
      take: String(this.pageSize)
    });
    return `/activities/programs/${encodeURIComponent(slug)}?${params.toString()}`;
  });

  protected readonly activities = computed(() =>
    this.activitiesResource.hasValue() ? this.activitiesResource.value()[0] : []
  );
  protected readonly activitiesCount = computed(() =>
    this.activitiesResource.hasValue() ? this.activitiesResource.value()[1] : 0
  );

  protected readonly logoUrl = computed(() => {
    if (!this.programResource.hasValue()) return '';
    const logo = this.programResource.value().logo;
    return logo ? `${environment.apiUrl}/uploads/programs/${encodeURIComponent(logo)}` : '';
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
