import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe } from 'rxjs';
import type { IVenture } from '@/app/shared/interfaces';
import type { IChangeVentureStatusCommand, IVenturesState } from '../interfaces';

const initialState: IVenturesState = {
  ventureId: '',
  error: ''
};

export const VenturesStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    changeStatus: rxMethod<IChangeVentureStatusCommand>(
      pipe(
        concatMap(({ id, payload }) => {
          patchState(store, { ventureId: id, error: '' });
          return _http.post<IVenture>(`/ventures/${id}/status`, payload).pipe(
            catchError(() => {
              patchState(store, { error: 'Unable to change the venture status. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { ventureId: '' }))
          );
        })
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
