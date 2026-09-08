import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, minLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Message } from '@/app/shared/ui/message/message';
import { ResetPasswordStore } from '../../data-access';

@Component({
  selector: 'auth-reset-password',
  templateUrl: './reset-password.html',
  providers: [ResetPasswordStore],
  imports: [RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormField, Message]
})
export class AuthResetPassword {
  private readonly route = inject(ActivatedRoute);
  protected readonly authStore = inject(ResetPasswordStore);
  protected token = signal(this.route.snapshot.queryParamMap.get('token') ?? '');
  protected hasToken = computed(() => this.token().trim().length > 0);
  protected resetPasswordFormModel = signal({
    password: '',
    confirmPassword: ''
  });
  protected resetPasswordForm = form(this.resetPasswordFormModel, (form) => {
    required(form.password, { message: 'Veuillez saisir un mot de passe' });
    minLength(form.password, 6, { message: 'Le mot de passe doit contenir au moins 6 caractères' });
    required(form.confirmPassword, {
      message: 'Veuillez confirmer votre mot de passe'
    });
    validate(form.confirmPassword, (ctx) => {
      const password = ctx.valueOf(form.password);
      const confirmPassword = ctx.value();

      if (!password || !confirmPassword) return null;

      if (password !== confirmPassword) {
        return {
          kind: 'mismatch',
          message: 'Les mots de passe ne correspondent pas'
        };
      }

      return null;
    });
  });

  resetPassword(event: Event) {
    event.preventDefault();
    if (!this.hasToken()) return;

    submit(this.resetPasswordForm, async () => {
      this.authStore.resetPassword({
        password: this.resetPasswordFormModel().password,
        token: this.token()
      });
    });
  }
}
