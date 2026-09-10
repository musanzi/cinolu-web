import { DatePipe, TitleCasePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, debounced, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { VentureStage, VentureStatus } from '@/app/shared/interfaces';
import { environment } from '@/environments/environment';
import {
  ISectorsLookupResponse,
  IVentureFilterKey,
  IVentureFilterOption,
  IVenturesQuery,
  IVenturesResponse
} from '../../interfaces';

@Component({
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    RouterLink,
    TitleCasePipe
  ],
  templateUrl: './list-ventures.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ListVentures {
  protected readonly pageSize = 40;
  protected readonly page = signal(1);
  protected readonly q = signal('');
  protected readonly sectorId = signal('');
  protected readonly stage = signal<VentureStage | ''>('');
  protected readonly status = signal<VentureStatus | ''>('');
  private readonly debouncedQuery = debounced(this.q, 300);
  protected readonly displayedColumns = ['venture', 'owner', 'stage', 'status', 'createdAt', 'actions'];

  protected readonly stageOptions: IVentureFilterOption<VentureStage>[] = [
    { value: VentureStage.IDEA, label: 'Idea' },
    { value: VentureStage.MVP, label: 'MVP' },
    { value: VentureStage.EARLY_STAGE, label: 'Early stage' },
    { value: VentureStage.GROWTH, label: 'Growth' },
    { value: VentureStage.MATURE, label: 'Mature' }
  ];
  protected readonly statusOptions: IVentureFilterOption<VentureStatus>[] = [
    { value: VentureStatus.PENDING, label: 'Pending' },
    { value: VentureStatus.APPROVED, label: 'Approved' },
    { value: VentureStatus.REJECTED, label: 'Rejected' }
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
    return `/ventures/staff?${params.toString()}`;
  });
  protected readonly sectorsResource = httpResource<ISectorsLookupResponse>(() => '/sectors?take=1000');
  protected readonly ventures = computed(() =>
    this.venturesResource.hasValue() ? this.venturesResource.value()[0] : []
  );
  protected readonly total = computed(() => (this.venturesResource.hasValue() ? this.venturesResource.value()[1] : 0));
  protected readonly sectors = computed(() => (this.sectorsResource.hasValue() ? this.sectorsResource.value()[0] : []));

  protected updateFilter(target: IVentureFilterKey, value: string): void {
    this.page.set(1);
    if (target === 'q') this.q.set(value);
    if (target === 'sectorId') this.sectorId.set(value);
    if (target === 'stage') this.stage.set(value as VentureStage | '');
    if (target === 'status') this.status.set(value as VentureStatus | '');
  }

  protected clearFilters(): void {
    this.q.set('');
    this.sectorId.set('');
    this.stage.set('');
    this.status.set('');
    this.page.set(1);
  }

  protected onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }

  protected logoUrl(logo: string): string {
    return logo.startsWith('http') ? logo : `${environment.apiUrl}/uploads/ventures/${encodeURIComponent(logo)}`;
  }

  protected hideBrokenImage(event: Event): void {
    (event.target as HTMLImageElement).hidden = true;
  }
}
