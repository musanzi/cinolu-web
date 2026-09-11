import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, debounced, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@/environments/environment';
import { Media } from '@/app/core/media';
import type { IActivity } from '@/app/shared/interfaces';
import { filter } from 'rxjs';
import { ActivitiesStore } from '../../data-access/activities.store';
import type {
  IActivitiesQuery,
  IActivitiesResponse,
  IActivityFormResult,
  IActivityLookups,
  ICategoriesLookupResponse,
  IMentorsLookupResponse,
  IProgramsLookupResponse,
  IRemoveActivityDialogData,
  ITypesLookupResponse
} from '../../interfaces';
import { AddActivitySidebar } from '../../ui/add-activity-sidebar/add-activity-sidebar';
import { RemoveActivityDialog } from '../../ui/remove-activity-dialog/remove-activity-dialog';
import { UpdateActivitySidebar } from '../../ui/update-activity-sidebar/update-activity-sidebar';

function parsePage(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function parseDate(value: string | null): Date | null {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

@Component({
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    AddActivitySidebar,
    UpdateActivitySidebar
  ],
  host: {
    class: 'lg:h-full'
  },
  templateUrl: './list-activities.html',
  providers: [ActivitiesStore]
})
export default class ListActivities {
  protected readonly store = inject(ActivitiesStore);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly media = inject(Media);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly initialQueryParams = this.route.snapshot.queryParamMap;

  protected readonly pageSize = 40;
  protected readonly page = signal(parsePage(this.initialQueryParams.get('page')));
  protected readonly q = signal(this.initialQueryParams.get('q') ?? '');
  protected readonly startDate = signal(parseDate(this.initialQueryParams.get('startDate')));
  protected readonly endDate = signal(parseDate(this.initialQueryParams.get('endDate')));
  protected readonly selectedActivity = signal<IActivity | undefined>(undefined);
  protected readonly isCreating = signal(false);
  private readonly debouncedQuery = debounced(this.q, 300);

  private readonly query = computed<IActivitiesQuery>(() => {
    const q = this.debouncedQuery.value().trim();
    const startDate = this.startDate();
    const endDate = this.endDate();
    return {
      page: this.page(),
      limit: this.pageSize,
      ...(q && { q }),
      ...(startDate && { startDate: startDate.toISOString() }),
      ...(endDate && { endDate: endDate.toISOString() })
    };
  });

  protected readonly activitiesResource = httpResource<IActivitiesResponse>(() => {
    const query = this.query();
    const params = new URLSearchParams({ page: String(query.page), limit: String(query.limit) });
    if (query.q) params.set('q', query.q);
    if (query.startDate) params.set('startDate', query.startDate);
    if (query.endDate) params.set('endDate', query.endDate);
    return `/activities/staff?${params.toString()}`;
  });
  private readonly programsResource = httpResource<IProgramsLookupResponse>(() => '/programs?take=100');
  private readonly mentorsResource = httpResource<IMentorsLookupResponse>(() => '/users/mentors');
  private readonly typesResource = httpResource<ITypesLookupResponse>(() => '/types?take=100');
  private readonly categoriesResource = httpResource<ICategoriesLookupResponse>(() => '/categories?take=100');

  protected readonly activities = computed(() =>
    this.activitiesResource.hasValue() ? this.activitiesResource.value()[0] : []
  );
  protected readonly total = computed(() =>
    this.activitiesResource.hasValue() ? this.activitiesResource.value()[1] : 0
  );
  protected readonly lookups = computed<IActivityLookups>(() => ({
    programs: this.programsResource.hasValue() ? this.programsResource.value()[0] : [],
    mentors: this.mentorsResource.hasValue() ? this.mentorsResource.value() : [],
    types: this.typesResource.hasValue() ? this.typesResource.value()[0] : [],
    categories: this.categoriesResource.hasValue() ? this.categoriesResource.value()[0] : []
  }));
  protected readonly areLookupsLoading = computed(
    () =>
      this.programsResource.isLoading() ||
      this.mentorsResource.isLoading() ||
      this.typesResource.isLoading() ||
      this.categoriesResource.isLoading()
  );
  protected readonly lookupsError = computed(
    () =>
      this.programsResource.error() ||
      this.mentorsResource.error() ||
      this.typesResource.error() ||
      this.categoriesResource.error()
  );
  protected readonly hasFilters = computed(() => Boolean(this.q() || this.startDate() || this.endDate()));
  protected readonly isSidebarOpen = computed(() => this.isCreating() || this.selectedActivity() !== undefined);

  constructor() {
    effect(() => {
      const query = this.query();

      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          page: query.page,
          q: query.q ?? null,
          startDate: query.startDate ?? null,
          endDate: query.endDate ?? null
        },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    });
  }

  protected onSearch(event: Event): void {
    this.q.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  protected onStartDateChange(value: Date | null): void {
    this.startDate.set(value);
    this.page.set(1);
  }

  protected onEndDateChange(value: Date | null): void {
    this.endDate.set(value);
    this.page.set(1);
  }

  protected clearFilters(): void {
    this.q.set('');
    this.startDate.set(null);
    this.endDate.set(null);
    this.page.set(1);
  }

  protected onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }

  protected openCreateSidebar(): void {
    this.selectedActivity.set(undefined);
    this.isCreating.set(true);
  }

  protected openUpdateSidebar(activity: IActivity): void {
    this.isCreating.set(false);
    this.selectedActivity.set(activity);
  }

  protected closeSidebar(): void {
    this.isCreating.set(false);
    this.selectedActivity.set(undefined);
  }

  protected createActivity(result: IActivityFormResult): void {
    this.store.createActivity(result);
  }

  protected updateActivity(activity: IActivity, result: IActivityFormResult): void {
    this.store.updateActivity({ id: activity.id, ...result });
  }

  protected togglePublication(activity: IActivity): void {
    this.store.togglePublication({ id: activity.id });
  }

  protected openRemoveDialog(activity: IActivity): void {
    this.dialog
      .open<RemoveActivityDialog, IRemoveActivityDialogData, boolean>(RemoveActivityDialog, {
        data: { activity },
        width: '28rem',
        maxWidth: 'calc(100vw - 2rem)'
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.store.removeActivity({ id: activity.id }));
  }

  protected reloadLookups(): void {
    this.programsResource.reload();
    this.mentorsResource.reload();
    this.typesResource.reload();
    this.categoriesResource.reload();
  }

  protected coverUrl(cover: string): string {
    return cover.startsWith('http') ? cover : `${environment.apiUrl}/uploads/activities/${encodeURIComponent(cover)}`;
  }

  protected hideBrokenCover(event: Event): void {
    (event.target as HTMLImageElement).hidden = true;
  }

  protected showCover(event: Event): void {
    (event.target as HTMLImageElement).hidden = false;
  }
}
