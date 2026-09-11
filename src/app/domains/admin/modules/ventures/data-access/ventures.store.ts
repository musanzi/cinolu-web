import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, tap } from 'rxjs';
import type { IVenture } from '@/app/shared/interfaces';
import type { IChangeVentureStatusCommand, IVenturesState } from '../interfaces';

const initialState: IVenturesState = {
  changingVentureId: '',
  mutationVersion: 0,
  error: ''
};

export const VenturesStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    changeStatus: rxMethod<IChangeVentureStatusCommand>(
      pipe(
        concatMap(({ id, payload }) => {
          patchState(store, { changingVentureId: id, error: '' });
          return _http.post<IVenture>(`/ventures/${id}/status`, payload).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to change the venture status. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { changingVentureId: '' }))
          );
        })
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
