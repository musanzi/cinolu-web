import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs';
import type { ICohort, IProgram } from '@/app/shared/interfaces';
import { Message } from '@/app/shared/ui';
import { CohortsStore } from '../../data-access/cohorts.store';
import type {
  ICohortsQuery,
  ICohortsResponse,
  IRemoveCohortDialogData
} from '../../interfaces';
import { CohortForm } from '../cohort-form/cohort-form';
import { RemoveCohortDialog } from '../remove-cohort-dialog/remove-cohort-dialog';

@Component({
  selector: 'cohorts-sidebar',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    Message,
    CohortForm
  ],
  templateUrl: './cohorts-sidebar.html',
  providers: [CohortsStore]
})
export class CohortsSidebar {
  readonly program = input.required<IProgram>();
  readonly cancelled = output<void>();

  protected readonly store = inject(CohortsStore);
  private readonly dialog = inject(MatDialog);

  protected readonly pageSize = 40;
  protected readonly page = signal(1);
  protected readonly isAdding = signal(false);
  protected readonly selectedCohort = signal<ICohort | undefined>(undefined);
  protected readonly displayedColumns = ['name', 'actions'];

  private readonly query = computed<ICohortsQuery>(() => ({
    programId: this.program().id,
    page: this.page(),
    limit: this.pageSize
  }));

  protected readonly cohortsResource = httpResource<ICohortsResponse>(() => {
    this.store.mutationVersion();
    const query = this.query();
    const params = new URLSearchParams({
      programId: query.programId,
      page: String(query.page),
      limit: String(query.limit)
    });
    return `/cohorts?${params.toString()}`;
  });

  protected readonly cohorts = computed(() =>
    this.cohortsResource.hasValue() ? this.cohortsResource.value()[0] : []
  );
  protected readonly cohortsCount = computed(() =>
    this.cohortsResource.hasValue() ? this.cohortsResource.value()[1] : 0
  );

  constructor() {
    effect(() => {
      if (this.store.mutationVersion() === 0) return;
      this.cohortsResource.reload();
      this.isAdding.set(false);
      this.selectedCohort.set(undefined);
    });
  }

  protected onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }

  protected openCreateForm(): void {
    this.selectedCohort.set(undefined);
    this.isAdding.set(true);
  }

  protected openUpdateForm(cohort: ICohort): void {
    this.isAdding.set(false);
    this.selectedCohort.set(cohort);
  }

  protected closeForm(): void {
    this.isAdding.set(false);
    this.selectedCohort.set(undefined);
  }

  protected closeSidebar(): void {
    this.closeForm();
    this.cancelled.emit();
  }

  protected submitForm(result: { name: string }): void {
    if (this.isAdding()) {
      this.store.createCohort({ name: result.name, programId: this.program().id });
      return;
    }

    const cohort = this.selectedCohort();
    if (cohort) {
      this.store.updateCohort({ id: cohort.id, payload: { name: result.name } });
    }
  }

  protected openRemoveDialog(cohort: ICohort): void {
    this.dialog
      .open<RemoveCohortDialog, IRemoveCohortDialogData, boolean>(RemoveCohortDialog, {
        data: { cohort },
        width: '28rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(filter((confirmed) => confirmed === true))
      .subscribe(() => this.store.removeCohort({ id: cohort.id }));
  }
}
