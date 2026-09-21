import { signalStore, withState, withMethods, patchState, withProps, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, catchError, of, exhaustMap, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '@/app/shared/interfaces';
import { Roles } from '@/app/shared/enums';
import { ReturnUrl } from '@/app/core/return-url';
import { IAuthState } from '../interfaces';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<IAuthState>({ user: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router),
    _returnUrl: inject(ReturnUrl)
  })),
  withComputed(({ user }) => ({
    isAdmin: computed(() => {
      const roles = user()?.roles ?? [];

      return roles.includes(Roles.ADMIN) || roles.includes(Roles.STAFF);
    }),

    isUser: computed(() => user()?.roles?.includes(Roles.USER))
  })),
  withMethods(({ _http, _router, _returnUrl, ...store }) => ({
    initialize: () => {
      return _http.get<IUser>('/auth/me').pipe(
        map((user) => {
          patchState(store, { user });
          return user;
        }),
        catchError(() => {
          patchState(store, { user: null });
          return of(null);
        })
      );
    },
    signOut: rxMethod<void>(
      pipe(
        exhaustMap(() =>
          _http.post<void>('/auth/signout', {}).pipe(
            tap(() => {
              _returnUrl.clear();
              _router.navigate(['/']);
              patchState(store, { user: null });
            }),
            catchError(() => {
              return of(null);
            })
          )
        )
      )
    ),
    setUser: (user: IUser | null) => {
      patchState(store, { user });
    }
  }))
);
