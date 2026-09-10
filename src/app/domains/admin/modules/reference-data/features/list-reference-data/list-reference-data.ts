import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { ReferenceDataStore } from '../../data-access/reference-data.store';
import {
  INamedEntity,
  INamedEntityDialogData,
  INamedEntityDialogResult,
  IReferenceDataConfig,
  IReferenceDataResponse,
  IRemoveNamedEntityDialogData
} from '../../interfaces';
import { NamedEntityFormDialog } from '../../ui/named-entity-form-dialog/named-entity-form-dialog';
import { RemoveNamedEntityDialog } from '../../ui/remove-named-entity-dialog/remove-named-entity-dialog';

@Component({
  imports: [DatePipe, MatButtonModule, MatDialogModule, MatIconModule, MatTableModule],
  templateUrl: './list-reference-data.html',
  providers: [ReferenceDataStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ListReferenceData {
  protected readonly store = inject(ReferenceDataStore);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly config = this.route.snapshot.data['config'] as IReferenceDataConfig;
  protected readonly displayedColumns = ['name', 'createdAt', 'updatedAt', 'actions'];
  protected readonly entitiesResource = httpResource<IReferenceDataResponse>(() => {
    this.store.mutationVersion();
    return `${this.config.endpoint}?take=1000`;
  });
  protected readonly entities = computed(() =>
    this.entitiesResource.hasValue() ? this.entitiesResource.value()[0] : []
  );

  protected openCreateDialog(): void {
    this.dialog
      .open<NamedEntityFormDialog, INamedEntityDialogData, INamedEntityDialogResult>(NamedEntityFormDialog, {
        data: { singular: this.config.singular },
        width: '28rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(
        filter((result): result is INamedEntityDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ payload }) => this.store.create({ endpoint: this.config.endpoint, payload }));
  }

  protected openUpdateDialog(entity: INamedEntity): void {
    this.dialog
      .open<NamedEntityFormDialog, INamedEntityDialogData, INamedEntityDialogResult>(NamedEntityFormDialog, {
        data: { singular: this.config.singular, entity },
        width: '28rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(
        filter((result): result is INamedEntityDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ payload }) => this.store.update({ endpoint: this.config.endpoint, id: entity.id, payload }));
  }

  protected openRemoveDialog(entity: INamedEntity): void {
    this.dialog
      .open<RemoveNamedEntityDialog, IRemoveNamedEntityDialogData, boolean>(RemoveNamedEntityDialog, {
        data: { singular: this.config.singular, entity },
        width: '28rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.store.remove({ endpoint: this.config.endpoint, id: entity.id }));
  }
}
