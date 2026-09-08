import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';
import {
  IRemoveRoleCommand,
  IRolePayload,
  IRoleResponse,
  IRolesResponse,
  IRolesState,
  IUpdateRoleCommand
} from '../interfaces';

const initialState: IRolesState = {
  roles: [],
  isLoading: false,
  isSaving: false,
  removingRoleId: '',
  error: ''
};

export const RolesStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    loadRoles: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: '' })),
        switchMap(() =>
          _http.get<IRolesResponse>('/roles').pipe(
            tap(([roles]) => patchState(store, { roles })),
            catchError(() => {
              patchState(store, { error: 'Unable to load roles. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    createRole: rxMethod<IRolePayload>(
      pipe(
        concatMap((payload) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.post<IRoleResponse>('/roles', payload).pipe(
            tap((role) => patchState(store, { roles: [...store.roles(), role] })),
            catchError(() => {
              patchState(store, { error: 'Unable to create the role. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    updateRole: rxMethod<IUpdateRoleCommand>(
      pipe(
        concatMap(({ id, payload }) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.patch<IRoleResponse>(`/roles/${id}`, payload).pipe(
            tap((updatedRole) =>
              patchState(store, {
                roles: store.roles().map((role) => (role.id === id ? updatedRole : role))
              })
            ),
            catchError(() => {
              patchState(store, { error: 'Unable to update the role. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    removeRole: rxMethod<IRemoveRoleCommand>(
      pipe(
        concatMap(({ id }) => {
          patchState(store, { removingRoleId: id, error: '' });
          return _http.delete<void>(`/roles/${id}`).pipe(
            tap(() => patchState(store, { roles: store.roles().filter((role) => role.id !== id) })),
            catchError(() => {
              patchState(store, { error: 'Unable to delete the role. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { removingRoleId: '' }))
          );
        })
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
