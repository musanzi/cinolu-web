import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { IProgram } from '@/app/shared/interfaces';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, Observable, of, pipe, switchMap, tap } from 'rxjs';
import { ICreateProgramCommand, IProgramsState, IRemoveProgramCommand, IUpdateProgramCommand } from '../interfaces';

const initialState: IProgramsState = {
  isSaving: false,
  removingProgramId: '',
  mutationVersion: 0,
  error: ''
};

function uploadLogo(http: HttpClient, program: IProgram, logo?: File): Observable<IProgram> {
  if (!logo) return of(program);

  const body = new FormData();
  body.append('logo', logo);
  return http.post<IProgram>(`/programs/${program.id}/logo`, body);
}

export const ProgramsStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    createProgram: rxMethod<ICreateProgramCommand>(
      pipe(
        concatMap(({ payload, logo }) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.post<IProgram>('/programs', payload).pipe(
            switchMap((program) =>
              uploadLogo(_http, program, logo).pipe(
                catchError(() => {
                  patchState(store, { error: 'The program was created, but its logo could not be uploaded.' });
                  return of(program);
                })
              )
            ),
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to create the program. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    updateProgram: rxMethod<IUpdateProgramCommand>(
      pipe(
        concatMap(({ id, payload, logo }) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.patch<IProgram>(`/programs/${id}`, payload).pipe(
            switchMap((program) =>
              uploadLogo(_http, program, logo).pipe(
                catchError(() => {
                  patchState(store, { error: 'The program was updated, but its logo could not be uploaded.' });
                  return of(program);
                })
              )
            ),
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to update the program. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    removeProgram: rxMethod<IRemoveProgramCommand>(
      pipe(
        concatMap(({ id }) => {
          patchState(store, { removingProgramId: id, error: '' });
          return _http.delete<void>(`/programs/${id}`).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to delete the program. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { removingProgramId: '' }))
          );
        })
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
