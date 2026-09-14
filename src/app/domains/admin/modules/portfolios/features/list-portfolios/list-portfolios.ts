import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, debounced, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { IPortfolio } from '@/app/shared/interfaces';
import { environment } from '@/environments/environment';
import { filter } from 'rxjs';
import { PortfoliosStore } from '../../data-access/portfolios.store';
import {
  IPortfolioDialogData,
  IPortfolioDialogResult,
  IPortfolioQueryParams,
  IPortfoliosResponse,
  IRemovePortfolioDialogData
} from '../../interfaces';
import { PortfolioFormDialog } from '../../ui/portfolio-form-dialog/portfolio-form-dialog';
import { RemovePortfolioDialog } from '../../ui/remove-portfolio-dialog/remove-portfolio-dialog';
import { Message } from '@/app/shared/ui';

@Component({
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    Message
  ],
  templateUrl: './list-portfolios.html',
  providers: [PortfoliosStore]
})
export default class Portfolios {
  protected readonly store = inject(PortfoliosStore);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly page = signal(1);
  protected readonly q = signal('');
  protected readonly debouncedQuery = debounced(this.q, 300);
  protected readonly displayedColumns = ['logo', 'name', 'slug', 'description', 'updatedAt', 'actions'];

  private readonly queryParams = computed<IPortfolioQueryParams>(() => ({
    page: this.page(),
    q: this.debouncedQuery.value()
  }));

  protected readonly portfoliosResource = httpResource<IPortfoliosResponse>(() => ({
    url: '/portfolios',
    params: { page: this.queryParams().page, q: this.queryParams().q }
  }));

  protected logoUrl(logo: string): string {
    return `${environment.apiUrl}/uploads/portfolios/${logo}`;
  }

  protected onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }

  protected openCreateDialog(): void {
    this.dialog
      .open<PortfolioFormDialog, IPortfolioDialogData, IPortfolioDialogResult>(PortfolioFormDialog, {
        data: {},
        width: '32rem'
      })
      .afterClosed()
      .pipe(
        filter((result): result is IPortfolioDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ payload, logo }) =>
        this.store.createPortfolio({ payload, logo, onSuccess: () => this.portfoliosResource.reload() })
      );
  }

  protected openUpdateDialog(portfolio: IPortfolio): void {
    this.dialog
      .open<PortfolioFormDialog, IPortfolioDialogData, IPortfolioDialogResult>(PortfolioFormDialog, {
        data: { portfolio },
        width: '32rem'
      })
      .afterClosed()
      .pipe(
        filter((result): result is IPortfolioDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ payload, logo }) =>
        this.store.updatePortfolio({
          id: portfolio.id,
          payload,
          logo,
          onSuccess: () => this.portfoliosResource.reload()
        })
      );
  }

  protected openRemoveDialog(portfolio: IPortfolio): void {
    this.dialog
      .open<RemovePortfolioDialog, IRemovePortfolioDialogData, boolean>(RemovePortfolioDialog, {
        data: { portfolio },
        width: '28rem'
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() =>
        this.store.removePortfolio({ id: portfolio.id, onSuccess: () => this.portfoliosResource.reload() })
      );
  }
}
