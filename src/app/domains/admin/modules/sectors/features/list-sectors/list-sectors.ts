import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, debounced, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ISector } from '@/app/shared/interfaces';
import { filter } from 'rxjs';
import { SectorsStore } from '../../data-access/sectors.store';
import {
  IRemoveSectorDialogData,
  ISectorDialogData,
  ISectorDialogResult,
  ISectorsQueryParams,
  ISectorsResponse
} from '../../interfaces';
import { SectorFormDialog } from '../../ui/sector-form-dialog/sector-form-dialog';
import { RemoveSectorDialog } from '../../ui/remove-sector-dialog/remove-sector-dialog';
import { Message } from '@/app/shared/ui';

@Component({
  imports: [
    DatePipe,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    Message
  ],
  templateUrl: './list-sectors.html',
  providers: [SectorsStore]
})
export default class ListSectors {
  protected readonly store = inject(SectorsStore);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly pageSize = 40;
  protected readonly page = signal(1);
  protected readonly q = signal('');
  protected readonly displayedColumns = ['name', 'createdAt', 'updatedAt', 'actions'];

  private readonly debouncedQuery = debounced(this.q, 300);
  private readonly queryParams = computed<ISectorsQueryParams>(() => {
    const q = this.debouncedQuery.value().trim();

    return {
      page: this.page(),
      limit: this.pageSize,
      ...(q && { q })
    };
  });

  protected readonly sectorsResource = httpResource<ISectorsResponse>(() => {
    this.store.mutationVersion();
    const query = this.queryParams();
    return {
      url: '/sectors',
      params: {
        page: query.page,
        limit: query.limit,
        ...(query.q && { q: query.q })
      }
    };
  });
  protected readonly sectors = computed(() => (this.sectorsResource.hasValue() ? this.sectorsResource.value()[0] : []));
  protected readonly total = computed(() => (this.sectorsResource.hasValue() ? this.sectorsResource.value()[1] : 0));

  protected onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }

  protected onSearch(event: Event): void {
    this.q.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  protected clearSearch(): void {
    this.q.set('');
    this.page.set(1);
  }

  protected openCreateDialog(): void {
    this.dialog
      .open<SectorFormDialog, ISectorDialogData, ISectorDialogResult>(SectorFormDialog, {
        data: {},
        width: '28rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(
        filter((result): result is ISectorDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ payload }) => this.store.createSector(payload));
  }

  protected openUpdateDialog(sector: ISector): void {
    this.dialog
      .open<SectorFormDialog, ISectorDialogData, ISectorDialogResult>(SectorFormDialog, {
        data: { sector },
        width: '28rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(
        filter((result): result is ISectorDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ payload }) => this.store.updateSector({ id: sector.id, payload }));
  }

  protected openRemoveDialog(sector: ISector): void {
    this.dialog
      .open<RemoveSectorDialog, IRemoveSectorDialogData, boolean>(RemoveSectorDialog, {
        data: { sector },
        width: '28rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.store.removeSector({ id: sector.id }));
  }
}
