import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { IType } from '@/app/shared/interfaces';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, tap } from 'rxjs';
import { IRemoveTypeCommand, ITypePayload, ITypesState, IUpdateTypeCommand } from '../interfaces';

const initialState: ITypesState = {
  isSaving: false,
  removingTypeId: '',
  mutationVersion: 0,
  error: ''
};

export const TypesStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    createType: rxMethod<ITypePayload>(
      pipe(
        concatMap((payload) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.post<IType>('/types', payload).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to create the type. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    updateType: rxMethod<IUpdateTypeCommand>(
      pipe(
        concatMap(({ id, payload }) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.patch<IType>(`/types/${id}`, payload).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to update the type. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    removeType: rxMethod<IRemoveTypeCommand>(
      pipe(
        concatMap(({ id }) => {
          patchState(store, { removingTypeId: id, error: '' });
          return _http.delete<void>(`/types/${id}`).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to delete the type. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { removingTypeId: '' }))
          );
        })
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
