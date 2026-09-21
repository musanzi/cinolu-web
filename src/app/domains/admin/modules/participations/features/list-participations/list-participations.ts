import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, debounced, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { ParticipationStatus } from '@/app/shared/interfaces';
import { Message } from '@/app/shared/ui';
import { ParticipationsStore } from '../../data-access/participations.store';
import type {
  IActivitiesLookupResponse,
  IParticipationRow,
  IParticipationsQuery,
  IParticipationsResponse,
  IRemoveParticipationDialogData
} from '../../interfaces';
import { RemoveParticipationDialog } from '../../ui/remove-participation-dialog/remove-participation-dialog';

@Component({
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    Message
  ],
  templateUrl: './list-participations.html',
  providers: [ParticipationsStore]
})
export default class ListParticipations {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly store = inject(ParticipationsStore);

  protected readonly pageSize = 40;
  protected readonly page = signal(1);
  protected readonly q = signal('');
  protected readonly status = signal<ParticipationStatus | ''>('');
  protected readonly activityId = signal('');
  protected readonly displayedColumns = ['participant', 'activity', 'status', 'submitted', 'actions'];
  protected readonly statuses = ParticipationStatus;
  protected readonly statusOptions = [
    { value: ParticipationStatus.PENDING, label: 'Pending' },
    { value: ParticipationStatus.APPROVED, label: 'Approved' },
    { value: ParticipationStatus.DECLINED, label: 'Declined' }
  ];
  private readonly debouncedQuery = debounced(this.q, 300);

  private readonly query = computed<IParticipationsQuery>(() => ({
    page: this.page(),
    limit: this.pageSize,
    q: this.debouncedQuery.value().trim(),
    status: this.status(),
    activityId: this.activityId()
  }));

  protected readonly activitiesResource = httpResource<IActivitiesLookupResponse>(() => '/activities/recent');

  protected readonly activities = computed(() =>
    this.activitiesResource.hasValue() ? this.activitiesResource.value() : []
  );

  protected readonly participationsResource = httpResource<IParticipationsResponse>(() => {
    this.store.mutationVersion();
    const query = this.query();
    const params = new URLSearchParams({
      page: String(query.page),
      limit: String(query.limit)
    });
    if (query.q) params.set('q', query.q);
    if (query.status) params.set('status', query.status);
    if (query.activityId) params.set('activityId', query.activityId);
    return `/participations/staff?${params.toString()}`;
  });

  protected readonly participations = computed(() =>
    this.participationsResource.hasValue() ? this.participationsResource.value()[0] : []
  );
  protected readonly participationsCount = computed(() =>
    this.participationsResource.hasValue() ? this.participationsResource.value()[1] : 0
  );

  protected onSearchChange(value: string): void {
    this.page.set(1);
    this.q.set(value);
  }

  protected onStatusChange(status: ParticipationStatus | ''): void {
    this.page.set(1);
    this.status.set(status);
  }

  protected onActivityChange(activityId: string): void {
    this.page.set(1);
    this.activityId.set(activityId);
  }

  protected onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }

  protected openParticipation(participation: IParticipationRow): void {
    void this.router.navigate(['/admin/participations', participation.id]);
  }

  protected updateStatus(participation: IParticipationRow, status: ParticipationStatus): void {
    this.store.updateParticipationStatus({ id: participation.id, status });
  }

  protected openRemoveDialog(participation: IParticipationRow): void {
    this.dialog
      .open<RemoveParticipationDialog, IRemoveParticipationDialogData, boolean>(RemoveParticipationDialog, {
        data: { participation },
        width: '28rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.store.removeParticipation({ id: participation.id }));
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
}
