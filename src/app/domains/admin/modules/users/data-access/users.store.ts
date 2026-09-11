import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';
import {
  IQueryParams,
  IRemoveUserCommand,
  IRolesLookupResponse,
  IUpdateUserCommand,
  IUserPayload,
  IUserResponse,
  IUsersResponse,
  IUsersState
} from '../interfaces';

const initialState: IUsersState = {
  users: [],
  usersCount: 0,
  roles: [],
  isLoading: false,
  isLoadingRoles: false,
  isSaving: false,
  isImporting: false,
  isExporting: false,
  removingUserId: '',
  error: ''
};

export const UsersStore = signalStore(
  withState(initialState),
  withProps(() => ({
    _document: inject(DOCUMENT),
    _http: inject(HttpClient)
  })),
  withMethods(({ _document, _http, ...store }) => ({
    loadUsers: rxMethod<IQueryParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: '' })),
        switchMap((params) =>
          _http.get<IUsersResponse>('/users', { params: { page: params.page, q: params.q } }).pipe(
            tap(([users, usersCount]) => patchState(store, { users, usersCount })),
            catchError(() => {
              patchState(store, { error: 'Unable to load users. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    loadRoles: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoadingRoles: true, error: '' })),
        switchMap(() =>
          _http.get<IRolesLookupResponse>('/roles').pipe(
            tap(([roles]) => patchState(store, { roles })),
            catchError(() => {
              patchState(store, { error: 'Unable to load roles.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoadingRoles: false }))
          )
        )
      )
    ),
    createUser: rxMethod<IUserPayload>(
      pipe(
        concatMap((payload) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.post<IUserResponse>('/users', payload).pipe(
            tap((user) => {
              patchState(store, {
                users: [user, ...store.users()],
                usersCount: store.usersCount() + 1
              });
            }),
            catchError(() => {
              patchState(store, { error: 'Unable to create the user. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    updateUser: rxMethod<IUpdateUserCommand>(
      pipe(
        concatMap(({ id, payload }) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.patch<IUserResponse>(`/users/${id}`, payload).pipe(
            tap((updatedUser) => {
              patchState(store, {
                users: store.users().map((currentUser) => (currentUser.id === id ? updatedUser : currentUser))
              });
            }),
            catchError(() => {
              patchState(store, { error: 'Unable to update the user. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    removeUser: rxMethod<IRemoveUserCommand>(
      pipe(
        concatMap(({ id }) => {
          patchState(store, { removingUserId: id, error: '' });
          return _http.delete<void>(`/users/${id}`).pipe(
            tap(() =>
              patchState(store, {
                users: store.users().filter((user) => user.id !== id),
                usersCount: Math.max(0, store.usersCount() - 1)
              })
            ),
            catchError(() => {
              patchState(store, { error: 'Unable to delete the user. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { removingUserId: '' }))
          );
        })
      )
    ),
    importUsers: rxMethod<File>(
      pipe(
        concatMap((file) => {
          patchState(store, { isImporting: true, error: '' });
          const body = new FormData();
          body.append('file', file);
          return _http.post<void>('/users/import/csv', body).pipe(
            catchError(() => {
              patchState(store, { error: 'Unable to import users. Check that the CSV has Name and Email headers.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isImporting: false }))
          );
        })
      )
    ),
    exportUsers: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isExporting: true, error: '' })),
        switchMap((q) =>
          _http.get('/users/export/csv', { params: { q }, responseType: 'blob' }).pipe(
            tap((csv) => {
              const urlApi = _document.defaultView?.URL;
              if (!urlApi) return;

              const url = urlApi.createObjectURL(csv);
              const link = _document.createElement('a');
              link.href = url;
              link.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
              link.click();
              urlApi.revokeObjectURL(url);
            }),
            catchError(() => {
              patchState(store, { error: 'Unable to export users. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isExporting: false }))
          )
        )
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
