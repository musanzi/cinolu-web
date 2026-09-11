import { DatePipe } from '@angular/common';
import { Component, computed, debounced, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UsersStore } from '../../data-access/users.store';
import type { IQueryParams, IRemoveUserDialogData, IUserPayload, IUserRow } from '../../interfaces';
import { AddUserSidebar } from '../../ui/add-user-sidebar/add-user-sidebar';
import { RemoveUserDialog } from '../../ui/remove-user-dialog/remove-user-dialog';
import { UpdateUserSidebar } from '../../ui/update-user-sidebar/update-user-sidebar';

function parsePage(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

@Component({
  imports: [
    AddUserSidebar,
    DatePipe,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatTableModule,
    UpdateUserSidebar
  ],
  host: {
    class: 'lg:h-full'
  },
  templateUrl: './list-users.html',
  providers: [UsersStore]
})
export default class Users implements OnInit {
  protected readonly store = inject(UsersStore);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly initialQueryParams = this.route.snapshot.queryParamMap;

  protected readonly pageSize = 40;
  protected readonly page = signal(parsePage(this.initialQueryParams.get('page')));
  protected readonly q = signal(this.initialQueryParams.get('q') ?? '');
  protected readonly selectedUser = signal<IUserRow | undefined>(undefined);
  protected readonly isCreating = signal(false);
  protected readonly displayedColumns = ['name', 'email', 'roles', 'createdAt', 'actions'];
  private readonly debouncedQuery = debounced(this.q, 300);

  private readonly queryParams = computed<IQueryParams>(() => ({
    page: this.page(),
    q: this.debouncedQuery.value().trim()
  }));
  protected readonly isSidebarOpen = computed(() => this.isCreating() || this.selectedUser() !== undefined);

  private readonly loadUsersEffect = effect(() => {
    this.store.loadUsers(this.queryParams());
  });

  constructor() {
    effect(() => {
      const query = this.queryParams();

      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          page: query.page,
          q: query.q || null
        },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    });
  }

  ngOnInit(): void {
    this.store.loadRoles();
  }

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

  protected onImportSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.store.importUsers(file);
    input.value = '';
  }

  protected openCreateSidebar(): void {
    this.selectedUser.set(undefined);
    this.isCreating.set(true);
  }

  protected openUpdateSidebar(user: IUserRow): void {
    this.isCreating.set(false);
    this.selectedUser.set(user);
  }

  protected closeSidebar(): void {
    this.isCreating.set(false);
    this.selectedUser.set(undefined);
  }

  protected createUser(payload: IUserPayload): void {
    this.store.createUser(payload);
  }

  protected updateUser(user: IUserRow, payload: IUserPayload): void {
    this.store.updateUser({ id: user.id, payload });
  }

  protected openRemoveDialog(user: IUserRow): void {
    this.dialog
      .open<RemoveUserDialog, IRemoveUserDialogData, boolean>(RemoveUserDialog, {
        data: { user },
        width: '28rem'
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.store.removeUser({ id: user.id }));
  }
}
