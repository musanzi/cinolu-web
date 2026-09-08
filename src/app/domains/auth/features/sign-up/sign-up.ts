import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { Message } from '@/app/shared/ui/message/message';
import { SignUpStore } from '../../data-access';

@Component({
  selector: 'auth-sign-up',
  templateUrl: './sign-up.html',
  providers: [SignUpStore],
  imports: [RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormField, Message]
})
export class AuthSignUp {
  protected readonly authStore = inject(SignUpStore);
  protected signUpFormModel = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  protected signUpForm = form(this.signUpFormModel, (form) => {
    required(form.name, { message: 'Veuillez saisir votre nom' });
    required(form.email, { message: 'Veuillez saisir une adresse e-mail' });
    email(form.email, { message: 'Veuillez saisir une adresse e-mail valide' });
    required(form.password, { message: 'Veuillez saisir un mot de passe' });
    required(form.confirmPassword, { message: 'Veuillez confirmer votre mot de passe' });
    validate(form.confirmPassword, ({ value, valueOf }) => {
      if (value() !== valueOf(form.password)) {
        return {
          kind: 'passwordMismatch',
          message: 'Les mots de passe ne correspondent pas'
        };
      }
      return null;
    });
  });

  signUp(event: Event) {
    event.preventDefault();
    submit(this.signUpForm, async () => {
      const { email, name, password } = this.signUpFormModel();
      this.authStore.signUp({ email, name, password });
    });
  }
}
