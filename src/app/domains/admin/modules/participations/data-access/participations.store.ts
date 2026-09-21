import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, tap } from 'rxjs';
import type {
  IParticipationResponse,
  IParticipationsState,
  IRemoveParticipationCommand,
  IUpdateParticipationStatusCommand
} from '../interfaces';

const initialState: IParticipationsState = {
  isSaving: false,
  mutationVersion: 0,
  updateSucceeded: false,
  removingParticipationId: '',
  error: ''
};

export const ParticipationsStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    updateParticipationStatus: rxMethod<IUpdateParticipationStatusCommand>(
      pipe(
        concatMap(({ id, status }) => {
          patchState(store, { isSaving: true, updateSucceeded: false, error: '' });
          return _http
            .patch<IParticipationResponse>(`/participations/${encodeURIComponent(id)}/status`, { status })
            .pipe(
              tap(() =>
                patchState(store, {
                  updateSucceeded: true,
                  mutationVersion: store.mutationVersion() + 1
                })
              ),
              catchError(() => {
                patchState(store, { error: 'Unable to update the participation status. Please try again.' });
                return EMPTY;
              }),
              finalize(() => patchState(store, { isSaving: false }))
            );
        })
      )
    ),
    removeParticipation: rxMethod<IRemoveParticipationCommand>(
      pipe(
        concatMap(({ id }) => {
          patchState(store, { removingParticipationId: id, error: '' });
          return _http.delete<void>(`/participations/${encodeURIComponent(id)}`).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to delete the participation. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { removingParticipationId: '' }))
          );
        })
      )
    ),
    clearFeedback(): void {
      patchState(store, { updateSucceeded: false, error: '' });
    }
  }))
);
