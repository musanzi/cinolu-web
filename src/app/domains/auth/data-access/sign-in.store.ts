import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '@/app/shared/interfaces';
import { environment } from '@/environments/environment';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, tap } from 'rxjs';
import { ISignInPayload } from '../interfaces';
import { AuthStore } from './auth.store';
import { ReturnUrl } from '@/app/core/return-url';

export const SignInStore = signalStore(
  withState({ isLoading: false, error: '' }),
  withProps(() => {
    const _returnUrl = inject(ReturnUrl);

    return {
      _http: inject(HttpClient),
      _router: inject(Router),
      _route: inject(ActivatedRoute),
      _authStore: inject(AuthStore),
      _returnUrl,
      get googleSignInUrl(): string {
        const base = `${environment.apiUrl}/auth/signin/google`;
        const returnUrl = _returnUrl.peek();
        return returnUrl ? `${base}?returnUrl=${encodeURIComponent(returnUrl)}` : base;
      }
    };
  }),
  withMethods(({ _http, _authStore, _route, _router, _returnUrl, ...store }) => ({
    signIn: rxMethod<ISignInPayload>(
      pipe(
        concatMap((payload) => {
          patchState(store, { isLoading: true, error: '' });
          return _http.post<IUser>('/auth/signin', payload).pipe(
            tap((user) => {
              _authStore.setUser(user);
              const returnUrl = _returnUrl.pop();
              if (returnUrl) {
                void _router.navigateByUrl(returnUrl);
                return;
              }

              return _authStore.isAdmin() ? _router.navigate(['/admin']) : _router.navigate(['/user']);
            }),
            catchError(() => {
              patchState(store, { error: 'Incorrect email address or password.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          );
        })
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
