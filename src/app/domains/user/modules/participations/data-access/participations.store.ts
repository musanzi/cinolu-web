import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import type { IParticipation } from '@/app/shared/interfaces';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, tap } from 'rxjs';
import type {
  ICreateParticipationCommand,
  ICreateParticipationPayload,
  IParticipationsState,
  IUpdateParticipationCommand,
  IUpdateParticipationPayload
} from '../interfaces';

const initialState: IParticipationsState = {
  isSaving: false,
  mutationVersion: 0,
  createdParticipationId: '',
  updateSucceeded: false,
  error: ''
};

function createErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 409) return 'Vous avez déjà soumis une participation pour cette activité.';
  if (error.status === 401) return 'Connectez-vous pour participer à cette activité.';
  return 'Impossible d’envoyer votre participation. Veuillez réessayer.';
}

function updateErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 403 || error.status === 409) {
    return 'Cette participation ne peut plus être modifiée car elle a déjà été traitée.';
  }
  return 'Impossible de mettre à jour votre participation. Veuillez réessayer.';
}

export const ParticipationsStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    createParticipation: rxMethod<ICreateParticipationCommand>(
      pipe(
        concatMap(({ activityId, responses }) => {
          patchState(store, { isSaving: true, createdParticipationId: '', updateSucceeded: false, error: '' });
          const payload: ICreateParticipationPayload = {
            activityId,
            data: JSON.stringify(responses)
          };

          return _http.post<IParticipation>('/participations', payload).pipe(
            tap((participation) =>
              patchState(store, {
                createdParticipationId: participation.id,
                mutationVersion: store.mutationVersion() + 1
              })
            ),
            catchError((error: HttpErrorResponse) => {
              patchState(store, { error: createErrorMessage(error) });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    updateParticipation: rxMethod<IUpdateParticipationCommand>(
      pipe(
        concatMap(({ id, responses }) => {
          patchState(store, { isSaving: true, updateSucceeded: false, error: '' });
          const payload: IUpdateParticipationPayload = { data: JSON.stringify(responses) };

          return _http.patch<IParticipation>(`/participations/${encodeURIComponent(id)}`, payload).pipe(
            tap(() =>
              patchState(store, {
                updateSucceeded: true,
                mutationVersion: store.mutationVersion() + 1
              })
            ),
            catchError((error: HttpErrorResponse) => {
              patchState(store, { error: updateErrorMessage(error) });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    clearFeedback(): void {
      patchState(store, { createdParticipationId: '', updateSucceeded: false, error: '' });
    }
  }))
);
