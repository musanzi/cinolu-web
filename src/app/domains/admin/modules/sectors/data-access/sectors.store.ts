import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ISector } from '@/app/shared/interfaces';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, tap } from 'rxjs';
import { IRemoveSectorCommand, ISectorPayload, ISectorsState, IUpdateSectorCommand } from '../interfaces';

const initialState: ISectorsState = {
  isSaving: false,
  removingSectorId: '',
  mutationVersion: 0,
  error: ''
};

export const SectorsStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    createSector: rxMethod<ISectorPayload>(
      pipe(
        concatMap((payload) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.post<ISector>('/sectors', payload).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to create the sector. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    updateSector: rxMethod<IUpdateSectorCommand>(
      pipe(
        concatMap(({ id, payload }) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.patch<ISector>(`/sectors/${id}`, payload).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to update the sector. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    removeSector: rxMethod<IRemoveSectorCommand>(
      pipe(
        concatMap(({ id }) => {
          patchState(store, { removingSectorId: id, error: '' });
          return _http.delete<void>(`/sectors/${id}`).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to delete the sector. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { removingSectorId: '' }))
          );
        })
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
