import { Component, input, linkedSignal, output } from '@angular/core';
import { email, FormField, form, maxLength, minLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import type { IRole } from '@/app/shared/interfaces';
import type { IUserFormModel, IUserPayload, IUserRow } from '../../interfaces';

@Component({
  selector: 'user-form',
  imports: [FormField, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule],
  templateUrl: './user-form.html'
})
export class UserForm {
  readonly heading = input.required<string>();
  readonly submitLabel = input.required<string>();
  readonly roles = input.required<IRole[]>();
  readonly user = input<IUserRow>();
  readonly isSaving = input(false);
  readonly cancelled = output<void>();
  readonly submitted = output<IUserPayload>();

  protected readonly userModel = linkedSignal(() => this.createModel(this.user()));

  protected readonly userForm = form(this.userModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required.' });
    required(schemaPath.email, { message: 'Email address is required.' });
    email(schemaPath.email, { message: 'Email address is invalid.' });
    maxLength(schemaPath.name, 100, { message: 'Name cannot exceed 100 characters.' });
    minLength(schemaPath.roles, 1, { message: 'Select at least one role.' });
    validate(schemaPath.password, ({ value }) => {
      if (value() && value().length < 6)
        return { kind: 'minLength', message: 'Password must contain at least 6 characters.' };
      return undefined;
    });
  });

  protected onSubmit(): void {
    submit(this.userForm, async (formState) => {
      const value = formState().value();
      const socialLinks = {
        ...(value.socialLinks.facebook.trim() && { facebook: value.socialLinks.facebook.trim() }),
        ...(value.socialLinks.linkedin.trim() && { linkedin: value.socialLinks.linkedin.trim() }),
        ...(value.socialLinks.twitter.trim() && { twitter: value.socialLinks.twitter.trim() })
      };

      this.submitted.emit({
        email: value.email.trim(),
        name: value.name.trim(),
        roles: value.roles,
        ...(value.password && { password: value.password }),
        ...(value.jobTitle.trim() && { jobTitle: value.jobTitle.trim() }),
        ...(Object.keys(socialLinks).length && { socialLinks })
      });
    });
  }

  private createModel(user?: IUserRow): IUserFormModel {
    return {
      email: user?.email ?? '',
      name: user?.name ?? '',
      roles: this.roles()
        .filter((role) => user?.roles.includes(role.name))
        .map((role) => role.id),
      password: '',
      jobTitle: user?.jobTitle ?? '',
      socialLinks: {
        facebook: user?.socialLinks?.['facebook'] ?? '',
        linkedin: user?.socialLinks?.['linkedin'] ?? '',
        twitter: user?.socialLinks?.['twitter'] ?? ''
      }
    };
  }
}
