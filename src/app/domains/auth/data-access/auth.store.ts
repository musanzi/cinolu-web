import { signalStore, withState, withMethods, patchState, withProps, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, catchError, of, exhaustMap, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '@/app/shared/interfaces';
import { Roles } from '@/app/shared/enums';
import { IAuthState } from '../interfaces';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<IAuthState>({ user: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router)
  })),
  withComputed(({ user }) => ({
    isAdmin: computed(() => {
      return user()?.roles?.some((role) => role === Roles.STAFF);
    }),
    isUser: computed(() => {
      return user()?.roles?.some((r) => r === 'user');
    })
  })),
  withMethods(({ _http, _router, ...store }) => ({
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
