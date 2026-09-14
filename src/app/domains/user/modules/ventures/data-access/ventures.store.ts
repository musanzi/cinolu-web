import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, Observable, of, pipe, switchMap, tap } from 'rxjs';
import type { IVenture } from '@/app/shared/interfaces';
import type { IRemoveVentureCommand, ISaveVentureCommand, IUpdateVentureCommand, IVenturesState } from '../interfaces';

const initialState: IVenturesState = {
  isSaving: false,
  removingVentureId: '',
  error: '',
  success: ''
};

export const VenturesStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => {
    const uploadFile = (venture: IVenture, file: File | undefined, field: 'logo' | 'cover'): Observable<IVenture> => {
      if (!file) return of(venture);

      const body = new FormData();
      body.append(field, file);
      return _http.post<IVenture>(`/ventures/${encodeURIComponent(venture.id)}/${field}`, body);
    };

    const uploadImages = (venture: IVenture, logo?: File, cover?: File): Observable<IVenture> =>
      uploadFile(venture, logo, 'logo').pipe(switchMap((updatedVenture) => uploadFile(updatedVenture, cover, 'cover')));

    return {
      createVenture: rxMethod<ISaveVentureCommand>(
        pipe(
          concatMap(({ payload, logo, cover, onSuccess }) => {
            patchState(store, { isSaving: true, error: '', success: '' });
            return _http.post<IVenture>('/ventures', payload).pipe(
              switchMap((venture) => uploadImages(venture, logo, cover)),
              tap((venture) => {
                patchState(store, { success: 'Votre projet a été créé et envoyé pour validation.' });
                onSuccess(venture);
              }),
              catchError(() => {
                patchState(store, { error: 'Impossible de créer ce projet. Veuillez réessayer.' });
                return EMPTY;
              }),
              finalize(() => patchState(store, { isSaving: false }))
            );
          })
        )
      ),
      updateVenture: rxMethod<IUpdateVentureCommand>(
        pipe(
          concatMap(({ id, payload, logo, cover, onSuccess }) => {
            patchState(store, { isSaving: true, error: '', success: '' });
            return _http.patch<IVenture>(`/ventures/${encodeURIComponent(id)}`, payload).pipe(
              switchMap((venture) => uploadImages(venture, logo, cover)),
              tap((venture) => {
                patchState(store, { success: 'Les modifications ont été enregistrées.' });
                onSuccess(venture);
              }),
              catchError(() => {
                patchState(store, { error: 'Impossible de modifier ce projet. Veuillez réessayer.' });
                return EMPTY;
              }),
              finalize(() => patchState(store, { isSaving: false }))
            );
          })
        )
      ),
      removeVenture: rxMethod<IRemoveVentureCommand>(
        pipe(
          concatMap(({ id, onSuccess }) => {
            patchState(store, { removingVentureId: id, error: '', success: '' });
            return _http.delete<void>(`/ventures/${encodeURIComponent(id)}`).pipe(
              tap(() => {
                patchState(store, { success: 'Le projet a été supprimé.' });
                onSuccess();
              }),
              catchError(() => {
                patchState(store, { error: 'Impossible de supprimer ce projet. Veuillez réessayer.' });
                return EMPTY;
              }),
              finalize(() => patchState(store, { removingVentureId: '' }))
            );
          })
        )
      ),
      clearFeedback(): void {
        patchState(store, { error: '', success: '' });
      }
    };
  })
);
