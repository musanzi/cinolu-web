import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, tap } from 'rxjs';
import {
  ICreateNamedEntityCommand,
  INamedEntity,
  IReferenceDataState,
  IRemoveNamedEntityCommand,
  IUpdateNamedEntityCommand
} from '../interfaces';

const initialState: IReferenceDataState = {
  isSaving: false,
  removingEntityId: '',
  mutationVersion: 0,
  error: ''
};

export const ReferenceDataStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    create: rxMethod<ICreateNamedEntityCommand>(
      pipe(
        concatMap(({ endpoint, payload }) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.post<INamedEntity>(endpoint, payload).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to create this item. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    update: rxMethod<IUpdateNamedEntityCommand>(
      pipe(
        concatMap(({ endpoint, id, payload }) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.patch<INamedEntity>(`${endpoint}/${id}`, payload).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to update this item. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    remove: rxMethod<IRemoveNamedEntityCommand>(
      pipe(
        concatMap(({ endpoint, id }) => {
          patchState(store, { removingEntityId: id, error: '' });
          return _http.delete<void>(`${endpoint}/${id}`).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to delete this item. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { removingEntityId: '' }))
          );
        })
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
