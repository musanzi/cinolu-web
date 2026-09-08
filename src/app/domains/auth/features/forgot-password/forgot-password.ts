import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { Message } from '@/app/shared/ui/message/message';
import { ForgotPasswordStore } from '../../data-access';

@Component({
  selector: 'auth-forgot-password',
  templateUrl: './forgot-password.html',
  providers: [ForgotPasswordStore],
  imports: [MatFormFieldModule, RouterLink, MatInputModule, MatButtonModule, MatIconModule, FormField, Message]
})
export class AuthForgotPassword {
  protected readonly authStore = inject(ForgotPasswordStore);
  protected forgotPasswordFormModel = signal({
    email: ''
  });
  protected forgotPasswordForm = form(this.forgotPasswordFormModel, (form) => {
    required(form.email, { message: 'Veuillez saisir une adresse e-mail' });
    email(form.email, { message: 'Veuillez saisir une adresse e-mail valide' });
  });

  forgotPassword(event: Event) {
    event.preventDefault();
    submit(this.forgotPasswordForm, async () => {
      this.authStore.forgotPassword(this.forgotPasswordFormModel());
    });
  }
}
