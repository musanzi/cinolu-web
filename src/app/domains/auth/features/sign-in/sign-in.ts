import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { Message } from '@/app/shared/ui/message/message';
import { ReturnUrl } from '@/app/core/return-url';
import { SignInStore } from '../../data-access';

@Component({
  selector: 'auth-sign-in',
  templateUrl: './sign-in.html',
  providers: [SignInStore],
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FormField,
    MatDivider,
    Message
  ]
})
export class AuthSignIn {
  protected readonly authStore = inject(SignInStore);
  private readonly router = inject(Router);
  private readonly returnUrl = inject(ReturnUrl);
  protected readonly googleSignInUrl = this.authStore.googleSignInUrl;
  protected successMessage = signal<string | null>(this.getSuccessMessage());

  constructor() {
    this.returnUrl.saveOriginIfMissing();
  }

  protected signInFormModel = signal({
    email: '',
    password: ''
  });
  protected signInForm = form(this.signInFormModel, (form) => {
    required(form.email, { message: 'Veuillez saisir une adresse e-mail' });
    email(form.email, { message: 'Veuillez saisir une adresse e-mail valide' });

    required(form.password, { message: 'Veuillez saisir votre mot de passe' });
  });

  signIn(event: Event) {
    event.preventDefault();
    this.successMessage.set(null);
    submit(this.signInForm, async () => {
      this.authStore.signIn(this.signInFormModel());
    });
  }

  private getSuccessMessage(): string | null {
    const navigationMessage = this.router.currentNavigation()?.extras.state?.['successMessage'];
    const historyMessage = typeof history !== 'undefined' ? history.state?.successMessage : null;
    const message = navigationMessage ?? historyMessage;

    return typeof message === 'string' ? message : null;
  }
}
