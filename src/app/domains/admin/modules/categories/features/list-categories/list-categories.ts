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
import { ICategory } from '@/app/shared/interfaces';
import { filter } from 'rxjs';
import { CategoriesStore } from '../../data-access/categories.store';
import {
  ICategoriesResponse,
  ICategoriesQueryParams,
  ICategoryDialogData,
  ICategoryDialogResult,
  IRemoveCategoryDialogData
} from '../../interfaces';
import { CategoryFormDialog } from '../../ui/category-form-dialog/category-form-dialog';
import { RemoveCategoryDialog } from '../../ui/remove-category-dialog/remove-category-dialog';

@Component({
  imports: [
    DatePipe,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule
  ],
  templateUrl: './list-categories.html',
  providers: [CategoriesStore]
})
export default class ListCategories {
  protected readonly store = inject(CategoriesStore);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pageSize = 40;
  protected readonly page = signal(1);
  protected readonly q = signal('');
  protected readonly displayedColumns = ['name', 'createdAt', 'updatedAt', 'actions'];

  private readonly debouncedQuery = debounced(this.q, 300);
  private readonly queryParams = computed<ICategoriesQueryParams>(() => ({
    page: this.page(),
    limit: this.pageSize,
    q: this.debouncedQuery.value().trim()
  }));

  protected readonly categoriesResource = httpResource<ICategoriesResponse>(() => {
    this.store.mutationVersion();
    const query = this.queryParams();
    return {
      url: '/categories',
      params: { page: query.page, limit: query.limit, q: query.q }
    };
  });
  protected readonly categories = computed(() =>
    this.categoriesResource.hasValue() ? this.categoriesResource.value()[0] : []
  );

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
      .open<CategoryFormDialog, ICategoryDialogData, ICategoryDialogResult>(CategoryFormDialog, {
        data: {},
        width: '28rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(
        filter((result): result is ICategoryDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ payload }) => this.store.createCategory(payload));
  }

  protected openUpdateDialog(category: ICategory): void {
    this.dialog
      .open<CategoryFormDialog, ICategoryDialogData, ICategoryDialogResult>(CategoryFormDialog, {
        data: { category },
        width: '28rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(
        filter((result): result is ICategoryDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ payload }) => this.store.updateCategory({ id: category.id, payload }));
  }

  protected openRemoveDialog(category: ICategory): void {
    this.dialog
      .open<RemoveCategoryDialog, IRemoveCategoryDialogData, boolean>(RemoveCategoryDialog, {
        data: { category },
        width: '28rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.store.removeCategory({ id: category.id }));
  }
}
