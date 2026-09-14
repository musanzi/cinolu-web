import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { IParticipation, ParticipationStatus } from '@/app/shared/interfaces';
import { Message } from '@/app/shared/ui';
import { environment } from '@/environments/environment';
import { ParticipationsStore } from '../../data-access';
import type { IParticipationsQuery, IParticipationsResponse } from '../../interfaces';

@Component({
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    Message,
    RouterLink
  ],
  templateUrl: './list-participations.html',
  providers: [ParticipationsStore]
})
export default class ListParticipations {
  protected readonly store = inject(ParticipationsStore);
  protected readonly pageSize = 9;
  protected readonly page = signal(1);
  protected readonly status = signal<ParticipationStatus | ''>('');
  protected readonly statusOptions = [
    { value: ParticipationStatus.PENDING, label: 'En attente' },
    { value: ParticipationStatus.APPROVED, label: 'Approuvée' },
    { value: ParticipationStatus.DECLINED, label: 'Refusée' }
  ];

  private readonly query = computed<IParticipationsQuery>(() => ({
    page: this.page(),
    limit: this.pageSize,
    status: this.status()
  }));

  protected readonly participationsResource = httpResource<IParticipationsResponse>(() => {
    this.store.mutationVersion();
    const query = this.query();
    const params = new URLSearchParams({
      page: String(query.page),
      limit: String(query.limit)
    });
    if (query.status) params.set('status', query.status);
    return `/participations/mine?${params.toString()}`;
  });

  protected readonly participations = computed(() =>
    this.participationsResource.hasValue() ? this.participationsResource.value()[0] : []
  );
  protected readonly total = computed(() =>
    this.participationsResource.hasValue() ? this.participationsResource.value()[1] : 0
  );

  protected onStatusChange(status: ParticipationStatus | ''): void {
    this.status.set(status);
    this.page.set(1);
  }

  protected onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }

  protected statusLabel(status: ParticipationStatus): string {
    return this.statusOptions.find((option) => option.value === status)?.label ?? status;
  }

  protected statusClasses(status: ParticipationStatus): string {
    switch (status) {
      case ParticipationStatus.APPROVED:
        return 'border-emerald-200 bg-emerald-50 text-emerald-800';
      case ParticipationStatus.DECLINED:
        return 'border-red-200 bg-red-50 text-red-800';
      default:
        return 'border-amber-200 bg-amber-50 text-amber-800';
    }
  }

  protected coverUrl(participation: IParticipation): string {
    const cover = participation.activity.cover;
    if (!cover) return '/images/projects.jpg';
    return cover.startsWith('http') ? cover : `${environment.apiUrl}/uploads/activities/${encodeURIComponent(cover)}`;
  }
}
