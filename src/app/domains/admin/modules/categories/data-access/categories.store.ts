import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ICategory } from '@/app/shared/interfaces';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, tap } from 'rxjs';
import { ICategoriesState, ICategoryPayload, IRemoveCategoryCommand, IUpdateCategoryCommand } from '../interfaces';

const initialState: ICategoriesState = {
  isSaving: false,
  removingCategoryId: '',
  mutationVersion: 0,
  error: ''
};

export const CategoriesStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    createCategory: rxMethod<ICategoryPayload>(
      pipe(
        concatMap((payload) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.post<ICategory>('/categories', payload).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to create the category. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    updateCategory: rxMethod<IUpdateCategoryCommand>(
      pipe(
        concatMap(({ id, payload }) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.patch<ICategory>(`/categories/${id}`, payload).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to update the category. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    removeCategory: rxMethod<IRemoveCategoryCommand>(
      pipe(
        concatMap(({ id }) => {
          patchState(store, { removingCategoryId: id, error: '' });
          return _http.delete<void>(`/categories/${id}`).pipe(
            tap(() => patchState(store, { mutationVersion: store.mutationVersion() + 1 })),
            catchError(() => {
              patchState(store, { error: 'Unable to delete the category. Please try again.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { removingCategoryId: '' }))
          );
        })
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
