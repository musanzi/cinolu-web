import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, Observable, of, pipe, switchMap } from 'rxjs';
import type { IActivity } from '@/app/shared/interfaces';
import type {
  IActivitiesState,
  IActivityIdCommand,
  ICreateActivityCommand,
  IUpdateActivityCommand
} from '../interfaces';

const initialState: IActivitiesState = {
  isSaving: false,
  removingActivityId: '',
  togglingActivityId: '',
  error: ''
};

function uploadCover(http: HttpClient, activity: IActivity, cover?: File): Observable<IActivity> {
  if (!cover) return of(activity);

  const body = new FormData();
  body.append('cover', cover);
  return http.post<IActivity>(`/activities/${activity.id}/cover`, body);
}

export const ActivitiesStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    createActivity: rxMethod<ICreateActivityCommand>(
      pipe(
        concatMap(({ payload, cover }) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.post<IActivity>('/activities', payload).pipe(
            switchMap((activity) =>
              uploadCover(_http, activity, cover).pipe(
                catchError(() => {
                  patchState(store, { error: 'The activity was created, but its cover could not be uploaded.' });
                  return of(activity);
                })
              )
            ),
            catchError(() => {
              patchState(store, { error: 'Unable to create the activity. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    updateActivity: rxMethod<IUpdateActivityCommand>(
      pipe(
        concatMap(({ id, payload, cover }) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.patch<IActivity>(`/activities/${id}`, payload).pipe(
            switchMap((activity) =>
              uploadCover(_http, activity, cover).pipe(
                catchError(() => {
                  patchState(store, { error: 'The activity was updated, but its cover could not be uploaded.' });
                  return of(activity);
                })
              )
            ),
            catchError(() => {
              patchState(store, { error: 'Unable to update the activity. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    togglePublication: rxMethod<IActivityIdCommand>(
      pipe(
        concatMap(({ id }) => {
          patchState(store, { togglingActivityId: id, error: '' });
          return _http.patch<IActivity>(`/activities/${id}/publication`, null).pipe(
            catchError(() => {
              patchState(store, { error: 'Unable to change the publication status. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { togglingActivityId: '' }))
          );
        })
      )
    ),
    removeActivity: rxMethod<IActivityIdCommand>(
      pipe(
        concatMap(({ id }) => {
          patchState(store, { removingActivityId: id, error: '' });
          return _http.delete<void>(`/activities/${id}`).pipe(
            catchError(() => {
              patchState(store, { error: 'Unable to delete the activity. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { removingActivityId: '' }))
          );
        })
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
