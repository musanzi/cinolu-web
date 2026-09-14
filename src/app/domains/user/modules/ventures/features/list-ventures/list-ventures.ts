import { httpResource } from '@angular/common/http';
import { Component, computed, debounced, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { IVenture, VentureStage } from '@/app/shared/interfaces';
import { Message } from '@/app/shared/ui';
import { environment } from '@/environments/environment';
import { VenturesStore } from '../../data-access';
import type {
  IRemoveVentureDialogData,
  ISectorsResponse,
  IVentureFilterKey,
  IVentureFilterOption,
  IVentureFormResult,
  IVenturesQuery,
  IVenturesResponse
} from '../../interfaces';
import { RemoveVentureDialog } from '../../ui/remove-venture-dialog';
import { AddVentureSidebar } from '../../ui/add-venture-sidebar';
import { UpdateVentureSidebar } from '../../ui/update-venture-sidebar';

@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    Message,
    RouterLink,
    AddVentureSidebar,
    UpdateVentureSidebar
  ],
  templateUrl: './list-ventures.html',
  providers: [VenturesStore]
})
export default class ListVentures {
  protected readonly store = inject(VenturesStore);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pageSize = 12;
  protected readonly page = signal(1);
  protected readonly q = signal('');
  protected readonly sectorId = signal('');
  protected readonly stage = signal<VentureStage | ''>('');
  protected readonly status = signal<IVenture['status'] | ''>('');
  protected readonly selectedVenture = signal<IVenture | undefined>(undefined);
  protected readonly isCreating = signal(false);
  private readonly debouncedQuery = debounced(this.q, 300);

  protected readonly stageOptions: IVentureFilterOption<VentureStage>[] = [
    { value: VentureStage.IDEA, label: 'Idée' },
    { value: VentureStage.MVP, label: 'MVP' },
    { value: VentureStage.EARLY_STAGE, label: 'Premiers clients' },
    { value: VentureStage.GROWTH, label: 'Croissance' },
    { value: VentureStage.MATURE, label: 'Maturité' }
  ];
  protected readonly statusOptions: IVentureFilterOption<IVenture['status']>[] = [
    { value: 'pending', label: 'En attente' },
    { value: 'approved', label: 'Approuvé' },
    { value: 'rejected', label: 'Refusé' }
  ];

  private readonly query = computed<IVenturesQuery>(() => ({
    page: this.page(),
    limit: this.pageSize,
    q: this.debouncedQuery.value().trim(),
    sectorId: this.sectorId(),
    stage: this.stage(),
    status: this.status()
  }));

  protected readonly venturesResource = httpResource<IVenturesResponse>(() => {
    const query = this.query();
    const params = new URLSearchParams({ page: String(query.page), limit: String(query.limit) });
    if (query.q) params.set('q', query.q);
    if (query.sectorId) params.set('sectorId', query.sectorId);
    if (query.stage) params.set('stage', query.stage);
    if (query.status) params.set('status', query.status);
    return `/ventures/mine?${params.toString()}`;
  });
  protected readonly sectorsResource = httpResource<ISectorsResponse>(() => '/sectors?take=100');
  protected readonly ventures = computed(() =>
    this.venturesResource.hasValue() ? this.venturesResource.value()[0] : []
  );
  protected readonly total = computed(() => (this.venturesResource.hasValue() ? this.venturesResource.value()[1] : 0));
  protected readonly sectors = computed(() => (this.sectorsResource.hasValue() ? this.sectorsResource.value()[0] : []));
  protected readonly isSidebarOpen = computed(() => this.isCreating() || this.selectedVenture() !== undefined);

  protected updateFilter(target: IVentureFilterKey, value: string): void {
    this.page.set(1);
    if (target === 'q') this.q.set(value);
    if (target === 'sectorId') this.sectorId.set(value);
    if (target === 'stage') this.stage.set(value as VentureStage | '');
    if (target === 'status') this.status.set(value as IVenture['status'] | '');
  }

  protected onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }

  protected openCreateSidebar(): void {
    this.selectedVenture.set(undefined);
    this.isCreating.set(true);
  }

  protected openUpdateSidebar(venture: IVenture): void {
    this.isCreating.set(false);
    this.selectedVenture.set(venture);
  }

  protected closeSidebar(): void {
    this.isCreating.set(false);
    this.selectedVenture.set(undefined);
  }

  protected createVenture(result: IVentureFormResult): void {
    this.store.createVenture({
      ...result,
      onSuccess: () => {
        this.closeSidebar();
        this.venturesResource.reload();
      }
    });
  }

  protected updateVenture(venture: IVenture, result: IVentureFormResult): void {
    this.store.updateVenture({
      id: venture.id,
      ...result,
      onSuccess: () => {
        this.closeSidebar();
        this.venturesResource.reload();
      }
    });
  }

  protected openRemoveDialog(venture: IVenture): void {
    this.dialog
      .open<RemoveVentureDialog, IRemoveVentureDialogData, boolean>(RemoveVentureDialog, {
        data: { venture },
        width: '28rem'
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.store.removeVenture({ id: venture.id, onSuccess: () => this.venturesResource.reload() }));
  }

  protected stageLabel(stage: VentureStage): string {
    return this.stageOptions.find((option) => option.value === stage)?.label ?? stage;
  }

  protected statusLabel(status: IVenture['status']): string {
    return this.statusOptions.find((option) => option.value === status)?.label ?? status;
  }

  protected statusClasses(status: IVenture['status']): string {
    if (status === 'approved') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    if (status === 'rejected') return 'border-red-200 bg-red-50 text-red-800';
    return 'border-amber-200 bg-amber-50 text-amber-800';
  }

  protected imageUrl(image: string): string {
    return image.startsWith('http') ? image : `${environment.apiUrl}/uploads/ventures/${encodeURIComponent(image)}`;
  }
}
