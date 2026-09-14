import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '@/app/domains/auth/data-access/auth.store';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, tap } from 'rxjs';
import {
  IProfileImageResponse,
  IProfileResponse,
  IProfileState,
  IUpdatePasswordPayload,
  IUpdateProfilePayload
} from '../interfaces';

const initialState: IProfileState = {
  isUpdatingProfile: false,
  isUpdatingProfileImage: false,
  isUpdatingPassword: false,
  profileUpdated: false,
  profileImageUpdated: false,
  passwordUpdated: false,
  profileError: '',
  profileImageError: '',
  passwordError: ''
};

export const ProfileStore = signalStore(
  withState(initialState),
  withProps(() => ({
    _authStore: inject(AuthStore),
    _http: inject(HttpClient)
  })),
  withMethods(({ _authStore, _http, ...store }) => ({
    updateProfile: rxMethod<IUpdateProfilePayload>(
      pipe(
        concatMap((payload) => {
          patchState(store, { isUpdatingProfile: true, profileUpdated: false, profileError: '' });
          return _http.patch<IProfileResponse>('/auth/me/update', payload).pipe(
            tap((user) => {
              _authStore.setUser(user);
              patchState(store, { profileUpdated: true });
            }),
            catchError(() => {
              patchState(store, {
                profileError: 'Impossible de mettre à jour le profil. Veuillez réessayer.'
              });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isUpdatingProfile: false }))
          );
        })
      )
    ),
    updateProfileImage: rxMethod<File>(
      pipe(
        concatMap((image) => {
          patchState(store, { isUpdatingProfileImage: true, profileImageUpdated: false, profileImageError: '' });
          const body = new FormData();
          body.append('avatar', image);

          return _http.post<IProfileImageResponse>('/users/profile/avatar', body).pipe(
            tap((user) => {
              _authStore.setUser(user);
              patchState(store, { profileImageUpdated: true });
            }),
            catchError(() => {
              patchState(store, {
                profileImageError: 'Impossible de modifier la photo de profil. Veuillez réessayer.'
              });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isUpdatingProfileImage: false }))
          );
        })
      )
    ),
    updatePassword: rxMethod<IUpdatePasswordPayload>(
      pipe(
        concatMap((payload) => {
          patchState(store, { isUpdatingPassword: true, passwordUpdated: false, passwordError: '' });
          return _http.patch<IProfileResponse>('/auth/password/update', payload).pipe(
            tap((user) => {
              _authStore.setUser(user);
              patchState(store, { passwordUpdated: true });
            }),
            catchError(() => {
              patchState(store, {
                passwordError: 'Impossible de mettre à jour le mot de passe. Veuillez réessayer.'
              });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isUpdatingPassword: false }))
          );
        })
      )
    ),
    clearProfileMessage(): void {
      patchState(store, { profileUpdated: false, profileError: '' });
    },
    clearProfileImageMessage(): void {
      patchState(store, { profileImageUpdated: false, profileImageError: '' });
    },
    clearPasswordMessage(): void {
      patchState(store, { passwordUpdated: false, passwordError: '' });
    }
  }))
);
