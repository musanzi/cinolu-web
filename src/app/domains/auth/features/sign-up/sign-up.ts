import { Component, computed, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { RouterLink } from '@angular/router';
import { Message } from '@/app/shared/ui/message/message';
import { SignUpStore } from '../../data-access';

@Component({
  selector: 'auth-sign-up',
  templateUrl: './sign-up.html',
  providers: [SignUpStore],
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    FormField,
    Message
  ]
})
export class AuthSignUp {
  protected readonly authStore = inject(SignUpStore);
  protected signUpFormModel = signal({
    name: '',
    email: '',
    biography: '',
    password: '',
    confirmPassword: ''
  });
  protected signUpForm = form(this.signUpFormModel, (form) => {
    required(form.name, { message: 'Veuillez saisir votre nom' });
    required(form.email, { message: 'Veuillez saisir une adresse e-mail' });
    email(form.email, { message: 'Veuillez saisir une adresse e-mail valide' });
    required(form.biography, { message: 'Veuillez saisir une courte biographie' });
    required(form.password, { message: 'Veuillez saisir un mot de passe' });
    minLength(form.password, 6, { message: 'Le mot de passe doit contenir au moins 6 caractères' });
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
  protected readonly profileStepValid = computed(
    () => this.signUpForm.name().valid() && this.signUpForm.email().valid() && this.signUpForm.biography().valid()
  );

  continueToSecurity(stepper: MatStepper) {
    this.signUpForm.name().markAsTouched();
    this.signUpForm.email().markAsTouched();
    this.signUpForm.biography().markAsTouched();

    if (this.profileStepValid()) {
      stepper.next();
    }
  }

  signUp(event: Event, stepper: MatStepper) {
    event.preventDefault();

    if (stepper.selectedIndex === 0) {
      this.continueToSecurity(stepper);
      return;
    }

    submit(this.signUpForm, async () => {
      const { biography, email, name, password } = this.signUpFormModel();
      this.authStore.signUp({ biography, email, name, password });
    });
  }
}
