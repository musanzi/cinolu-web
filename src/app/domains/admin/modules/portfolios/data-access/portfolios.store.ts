import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, Observable, of, pipe, switchMap, tap } from 'rxjs';
import { IPortfolio } from '@/app/shared/interfaces';
import {
  IPortfoliosMutationState,
  IRemovePortfolioCommand,
  ISavePortfolioCommand,
  IUpdatePortfolioCommand
} from '../interfaces';

const initialState: IPortfoliosMutationState = {
  isSaving: false,
  removingPortfolioId: '',
  error: ''
};

export const PortfoliosStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => {
    const uploadLogo = (portfolio: IPortfolio, logo?: File): Observable<IPortfolio> => {
      if (!logo) return of(portfolio);

      const body = new FormData();
      body.append('logo', logo);
      return _http.post<IPortfolio>(`/portfolios/${portfolio.id}/logo`, body);
    };

    return {
      createPortfolio: rxMethod<ISavePortfolioCommand>(
        pipe(
          concatMap(({ payload, logo, onSuccess }) => {
            patchState(store, { isSaving: true, error: '' });
            return _http.post<IPortfolio>('/portfolios', payload).pipe(
              switchMap((portfolio) => uploadLogo(portfolio, logo)),
              tap(() => onSuccess()),
              catchError(() => {
                patchState(store, { error: 'Unable to create the portfolio. Please try again.' });
                return EMPTY;
              }),
              finalize(() => patchState(store, { isSaving: false }))
            );
          })
        )
      ),
      updatePortfolio: rxMethod<IUpdatePortfolioCommand>(
        pipe(
          concatMap(({ id, payload, logo, onSuccess }) => {
            patchState(store, { isSaving: true, error: '' });
            return _http.patch<IPortfolio>(`/portfolios/${id}`, payload).pipe(
              switchMap((portfolio) => uploadLogo(portfolio, logo)),
              tap(() => onSuccess()),
              catchError(() => {
                patchState(store, { error: 'Unable to update the portfolio. Please try again.' });
                return EMPTY;
              }),
              finalize(() => patchState(store, { isSaving: false }))
            );
          })
        )
      ),
      removePortfolio: rxMethod<IRemovePortfolioCommand>(
        pipe(
          concatMap(({ id, onSuccess }) => {
            patchState(store, { removingPortfolioId: id, error: '' });
            return _http.delete<void>(`/portfolios/${id}`).pipe(
              tap(() => onSuccess()),
              catchError(() => {
                patchState(store, { error: 'Unable to delete the portfolio. Please try again.' });
                return EMPTY;
              }),
              finalize(() => patchState(store, { removingPortfolioId: '' }))
            );
          })
        )
      ),
      clearError(): void {
        patchState(store, { error: '' });
      }
    };
  })
);
