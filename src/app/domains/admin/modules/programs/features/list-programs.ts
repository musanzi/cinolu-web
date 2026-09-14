import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, debounced, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { environment } from '@/environments/environment';
import { IProgram } from '@/app/shared/interfaces';
import { filter } from 'rxjs';
import { ProgramsStore } from '../data-access/programs.store';
import {
  IPortfoliosLookupResponse,
  IProgramDialogData,
  IProgramDialogResult,
  IProgramsQuery,
  IProgramsResponse,
  IRemoveProgramDialogData,
  IStaffLookupResponse
} from '../interfaces';
import { ProgramFormDialog } from '../ui/program-form-dialog';
import { RemoveProgramDialog } from '../ui/remove-program-dialog';
import { Message } from '@/app/shared/ui';

@Component({
  selector: 'app-list-programs',
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    Message
  ],
  templateUrl: './list-programs.html',
  providers: [ProgramsStore]
})
export default class Programs {
  protected readonly store = inject(ProgramsStore);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pageSize = 40;
  protected readonly page = signal(1);
  protected readonly q = signal('');
  protected readonly portfolioId = signal('');
  protected readonly debouncedQuery = debounced(this.q, 300);
  protected readonly displayedColumns = ['program', 'portfolio', 'managers', 'updatedAt', 'actions'];

  private readonly query = computed<IProgramsQuery>(() => ({
    page: this.page(),
    limit: this.pageSize,
    q: this.debouncedQuery.value().trim(),
    portfolioId: this.portfolioId()
  }));

  protected readonly programsResource = httpResource<IProgramsResponse>(() => {
    this.store.mutationVersion();
    const query = this.query();
    const params = new URLSearchParams({
      page: String(query.page),
      limit: String(query.limit)
    });
    if (query.q) params.set('q', query.q);
    if (query.portfolioId) params.set('portfolioId', query.portfolioId);
    return `/programs?${params.toString()}`;
  });
  protected readonly portfoliosResource = httpResource<IPortfoliosLookupResponse>(() => '/portfolios');
  protected readonly staffResource = httpResource<IStaffLookupResponse>(() => '/users/staff');

  protected readonly programs = computed(() =>
    this.programsResource.hasValue() ? this.programsResource.value()[0] : []
  );
  protected readonly programsCount = computed(() =>
    this.programsResource.hasValue() ? this.programsResource.value()[1] : 0
  );
  protected readonly portfolios = computed(() =>
    this.portfoliosResource.hasValue() ? this.portfoliosResource.value()[0] : []
  );
  protected readonly staff = computed(() => (this.staffResource.hasValue() ? this.staffResource.value() : []));
  protected readonly areLookupsLoading = computed(
    () => this.portfoliosResource.isLoading() || this.staffResource.isLoading()
  );

  protected onSearchChange(value: string): void {
    this.page.set(1);
    this.q.set(value);
  }

  protected onPortfolioChange(value: string): void {
    this.page.set(1);
    this.portfolioId.set(value);
  }

  protected onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }

  protected logoUrl(logo: string): string {
    return `${environment.apiUrl}/uploads/programs/${encodeURIComponent(logo)}`;
  }

  protected hideBrokenImage(event: Event): void {
    (event.target as HTMLImageElement).hidden = true;
  }

  protected openCreateDialog(): void {
    this.dialog
      .open<ProgramFormDialog, IProgramDialogData, IProgramDialogResult>(ProgramFormDialog, {
        data: { portfolios: this.portfolios(), staff: this.staff() },
        width: '34rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(
        filter((result): result is IProgramDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((command) => this.store.createProgram(command));
  }

  protected openUpdateDialog(program: IProgram): void {
    this.dialog
      .open<ProgramFormDialog, IProgramDialogData, IProgramDialogResult>(ProgramFormDialog, {
        data: { portfolios: this.portfolios(), staff: this.staff(), program },
        width: '34rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(
        filter((result): result is IProgramDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((command) => this.store.updateProgram({ id: program.id, ...command }));
  }

  protected openRemoveDialog(program: IProgram): void {
    this.dialog
      .open<RemoveProgramDialog, IRemoveProgramDialogData, boolean>(RemoveProgramDialog, {
        data: { program },
        width: '28rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.store.removeProgram({ id: program.id }));
  }
}
