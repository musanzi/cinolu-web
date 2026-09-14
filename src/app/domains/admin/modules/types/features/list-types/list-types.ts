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
import { IType } from '@/app/shared/interfaces';
import { filter } from 'rxjs';
import { TypesStore } from '../../data-access/types.store';
import {
  IRemoveTypeDialogData,
  ITypeDialogData,
  ITypeDialogResult,
  ITypesQueryParams,
  ITypesResponse
} from '../../interfaces';
import { RemoveTypeDialog } from '../../ui/remove-type-dialog/remove-type-dialog';
import { TypeFormDialog } from '../../ui/type-form-dialog/type-form-dialog';
import { Message } from '@/app/shared/ui';

@Component({
  selector: 'app-list-types',
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
  templateUrl: './list-types.html',
  providers: [TypesStore]
})
export default class ListTypes {
  protected readonly store = inject(TypesStore);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pageSize = 40;
  protected readonly page = signal(1);
  protected readonly q = signal('');
  protected readonly displayedColumns = ['name', 'createdAt', 'updatedAt', 'actions'];

  private readonly debouncedQuery = debounced(this.q, 300);
  private readonly queryParams = computed<ITypesQueryParams>(() => ({
    page: this.page(),
    limit: this.pageSize,
    q: this.debouncedQuery.value().trim()
  }));

  protected readonly typesResource = httpResource<ITypesResponse>(() => {
    this.store.mutationVersion();
    const query = this.queryParams();
    return {
      url: '/types',
      params: {
        page: query.page,
        limit: query.limit,
        q: query.q
      }
    };
  });
  protected readonly types = computed(() => (this.typesResource.hasValue() ? this.typesResource.value()[0] : []));

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
      .open<TypeFormDialog, ITypeDialogData, ITypeDialogResult>(TypeFormDialog, {
        data: {},
        width: '28rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(
        filter((result): result is ITypeDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ payload }) => this.store.createType(payload));
  }

  protected openUpdateDialog(type: IType): void {
    this.dialog
      .open<TypeFormDialog, ITypeDialogData, ITypeDialogResult>(TypeFormDialog, {
        data: { type },
        width: '28rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(
        filter((result): result is ITypeDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ payload }) => this.store.updateType({ id: type.id, payload }));
  }

  protected openRemoveDialog(type: IType): void {
    this.dialog
      .open<RemoveTypeDialog, IRemoveTypeDialogData, boolean>(RemoveTypeDialog, {
        data: { type },
        width: '28rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.store.removeType({ id: type.id }));
  }
}
