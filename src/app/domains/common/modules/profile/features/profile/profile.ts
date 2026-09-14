import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { email, form, FormField, minLength, pattern, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthStore } from '@/app/domains/auth/data-access/auth.store';
import { environment } from '@/environments/environment';
import { ProfileStore } from '../../data-access/profile.store';
import {
  IProfileFormModel,
  IProfileRolesResponse,
  IUpdatePasswordFormModel,
  IUpdateProfilePayload
} from '../../interfaces';
import { Message } from '@/app/shared/ui';

const WEB_URL_PATTERN = /^https?:\/\/\S+$/i;

@Component({
  imports: [
    Message,
    FormField,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './profile.html',
  providers: [ProfileStore]
})
export default class Profile {
  protected readonly authStore = inject(AuthStore);
  protected readonly store = inject(ProfileStore);

  private readonly user = this.authStore.user();
  private rolesInitialized = false;

  protected readonly rolesResource = httpResource<IProfileRolesResponse>(() =>
    this.authStore.isAdmin() ? '/roles?take=1000' : undefined
  );

  protected readonly availableRoles = computed(() =>
    this.rolesResource.hasValue() ? this.rolesResource.value()[0] : []
  );

  protected readonly profileImageUrl = computed(() => {
    const user = this.authStore.user();
    if (!user?.avatar) return '/images/avatar.webp';
    return user.avatar.startsWith('http')
      ? user.avatar
      : `${environment.apiUrl}/uploads/profiles/${encodeURIComponent(user.avatar)}`;
  });

  protected readonly profileModel = signal<IProfileFormModel>({
    name: this.user?.name ?? '',
    email: this.user?.email ?? '',
    jobTitle: this.user?.jobTitle ?? '',
    socialLinks: {
      facebook: this.user?.socialLinks?.['facebook'] ?? '',
      linkedin: this.user?.socialLinks?.['linkedin'] ?? '',
      twitter: this.user?.socialLinks?.['twitter'] ?? ''
    },
    roles: []
  });

  protected readonly profileForm = form(this.profileModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Le nom est requis.' });
    required(schemaPath.email, { message: "L'adresse e-mail est requise." });
    email(schemaPath.email, { message: "L'adresse e-mail est invalide." });
    pattern(schemaPath.socialLinks.facebook, WEB_URL_PATTERN, { message: "L'adresse Facebook est invalide." });
    pattern(schemaPath.socialLinks.linkedin, WEB_URL_PATTERN, { message: "L'adresse LinkedIn est invalide." });
    pattern(schemaPath.socialLinks.twitter, WEB_URL_PATTERN, { message: "L'adresse X est invalide." });
  });

  protected readonly passwordModel = signal<IUpdatePasswordFormModel>({
    password: '',
    confirmPassword: ''
  });

  protected readonly passwordForm = form(this.passwordModel, (schemaPath) => {
    required(schemaPath.password, { message: 'Le mot de passe est requis.' });
    minLength(schemaPath.password, 6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' });
    required(schemaPath.confirmPassword, { message: 'La confirmation est requise.' });
    validate(schemaPath.confirmPassword, ({ value, valueOf }) =>
      value() !== valueOf(schemaPath.password)
        ? { kind: 'password-match', message: 'Les mots de passe ne correspondent pas.' }
        : undefined
    );
  });

  protected hidePassword = true;
  protected hidePasswordConfirmation = true;

  constructor() {
    effect(() => {
      const roles = this.availableRoles();
      if (this.rolesInitialized || !this.rolesResource.hasValue()) return;

      this.rolesInitialized = true;
      untracked(() => {
        this.profileModel.update((model) => ({
          ...model,
          roles: roles.filter((role) => this.user?.roles.includes(role.name)).map((role) => role.id)
        }));
      });
    });

    effect(() => {
      if (this.store.passwordUpdated()) {
        untracked(() => {
          this.passwordModel.set({ password: '', confirmPassword: '' });
          this.passwordForm().reset();
        });
      }
    });
  }

  protected onUpdateProfile(): void {
    submit(this.profileForm, async (formState) => {
      const value = formState().value();
      const socialLinks = {
        ...(value.socialLinks.facebook.trim() && { facebook: value.socialLinks.facebook.trim() }),
        ...(value.socialLinks.linkedin.trim() && { linkedin: value.socialLinks.linkedin.trim() }),
        ...(value.socialLinks.twitter.trim() && { twitter: value.socialLinks.twitter.trim() })
      };
      const payload: IUpdateProfilePayload = {
        name: value.name.trim(),
        email: value.email.trim(),
        jobTitle: value.jobTitle.trim(),
        socialLinks,
        ...(this.authStore.isAdmin() && this.rolesResource.hasValue() && { roles: value.roles })
      };

      this.store.updateProfile(payload);
    });
  }

  protected onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const image = input.files?.[0];
    if (!image) return;

    this.store.updateProfileImage(image);
    input.value = '';
  }

  protected isRoleSelected(roleId: string): boolean {
    return this.profileModel().roles.includes(roleId);
  }

  protected onRoleChanged(roleId: string, change: MatCheckboxChange): void {
    this.profileModel.update((model) => ({
      ...model,
      roles: change.checked ? [...model.roles, roleId] : model.roles.filter((id) => id !== roleId)
    }));
  }

  protected onUpdatePassword(): void {
    submit(this.passwordForm, async (formState) => {
      this.store.updatePassword({ password: formState().value().password });
    });
  }
}
