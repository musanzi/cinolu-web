import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, tap } from 'rxjs';
import type { ICohort } from '@/app/shared/interfaces';
import type {
  ICreateCohortPayload,
  ICohortsState,
  IRemoveCohortCommand,
  IUpdateCohortCommand
} from '../interfaces';

const initialState: ICohortsState = {
  isSaving: false,
  removingCohortId: '',
  mutationVersion: 0,
  error: ''
};

export const CohortsStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    createCohort: rxMethod<ICreateCohortPayload>(
      pipe(
        concatMap((payload) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.post<ICohort>('/cohorts', payload).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to create the cohort. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    updateCohort: rxMethod<IUpdateCohortCommand>(
      pipe(
        concatMap(({ id, payload }) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.patch<ICohort>(`/cohorts/${id}`, payload).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to update the cohort. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    removeCohort: rxMethod<IRemoveCohortCommand>(
      pipe(
        concatMap(({ id }) => {
          patchState(store, { removingCohortId: id, error: '' });
          return _http.delete<void>(`/cohorts/${id}`).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to delete the cohort. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { removingCohortId: '' }))
          );
        })
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
