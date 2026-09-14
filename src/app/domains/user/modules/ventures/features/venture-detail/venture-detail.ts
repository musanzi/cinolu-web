import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { IVenture, VentureStage } from '@/app/shared/interfaces';
import { Message } from '@/app/shared/ui';
import { environment } from '@/environments/environment';
import { VenturesStore } from '../../data-access';
import type {
  IRemoveVentureDialogData,
  ISectorsResponse,
  IVentureFilterOption,
  IVentureFormResult
} from '../../interfaces';
import { RemoveVentureDialog } from '../../ui/remove-venture-dialog';
import { UpdateVentureSidebar } from '../../ui/update-venture-sidebar';

@Component({
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatIconModule,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    Message,
    RouterLink,
    UpdateVentureSidebar
  ],
  templateUrl: './venture-detail.html',
  providers: [VenturesStore]
})
export default class VentureDetail {
  protected readonly store = inject(VenturesStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ventureId = this.route.snapshot.paramMap.get('id') ?? '';
  protected readonly isEditing = signal(false);

  protected readonly stageOptions: IVentureFilterOption<VentureStage>[] = [
    { value: VentureStage.IDEA, label: 'Idée' },
    { value: VentureStage.MVP, label: 'MVP' },
    { value: VentureStage.EARLY_STAGE, label: 'Premiers clients' },
    { value: VentureStage.GROWTH, label: 'Croissance' },
    { value: VentureStage.MATURE, label: 'Maturité' }
  ];

  protected readonly ventureResource = httpResource<IVenture>(() =>
    this.ventureId ? `/ventures/mine/${encodeURIComponent(this.ventureId)}` : undefined
  );
  protected readonly sectorsResource = httpResource<ISectorsResponse>(() => '/sectors?take=100');
  protected readonly venture = computed(() =>
    this.ventureResource.hasValue() ? this.ventureResource.value() : undefined
  );
  protected readonly sectors = computed(() => (this.sectorsResource.hasValue() ? this.sectorsResource.value()[0] : []));

  protected openUpdateSidebar(): void {
    this.isEditing.set(true);
  }

  protected closeSidebar(): void {
    this.isEditing.set(false);
  }

  protected updateVenture(venture: IVenture, result: IVentureFormResult): void {
    this.store.updateVenture({
      id: venture.id,
      ...result,
      onSuccess: () => {
        this.closeSidebar();
        this.ventureResource.reload();
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
      .subscribe(() =>
        this.store.removeVenture({ id: venture.id, onSuccess: () => void this.router.navigate(['/user/ventures']) })
      );
  }

  protected stageLabel(stage: VentureStage): string {
    return this.stageOptions.find((option) => option.value === stage)?.label ?? stage;
  }

  protected statusLabel(status: IVenture['status']): string {
    if (status === 'approved') return 'Approuvé';
    if (status === 'rejected') return 'Refusé';
    return 'En attente';
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
