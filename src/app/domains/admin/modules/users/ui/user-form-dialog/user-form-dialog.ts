import { Component, inject, signal } from '@angular/core';
import { email, FormField, form, maxLength, minLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IUserDialogData, IUserDialogResult, IUserFormModel, IUserPayload } from '../../interfaces';

@Component({
  selector: 'app-user-form-dialog',
  imports: [FormField, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './user-form-dialog.html'
})
export class UserFormDialog {
  protected readonly data = inject<IUserDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<UserFormDialog, IUserDialogResult>);

  protected readonly userModel = signal<IUserFormModel>({
    email: this.data.user?.email ?? '',
    name: this.data.user?.name ?? '',
    roles: this.data.roles.filter((role) => this.data.user?.roles.includes(role.name)).map((role) => role.id),
    password: '',
    avatar: this.data.user?.avatar ?? '',
    jobTitle: this.data.user?.jobTitle ?? '',
    socialLinks: Object.keys(this.data.user?.socialLinks ?? {}).length
      ? JSON.stringify(this.data.user?.socialLinks, null, 2)
      : ''
  });

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
    validate(schemaPath.socialLinks, ({ value }) => {
      if (!value().trim()) return undefined;
      try {
        const links: unknown = JSON.parse(value());
        if (!links || Array.isArray(links) || typeof links !== 'object') throw new Error();
        return undefined;
      } catch {
        return { kind: 'json', message: 'Enter a valid JSON object.' };
      }
    });
  });

  protected onSubmit(): void {
    submit(this.userForm, async (formState) => {
      const value = formState().value();
      const payload: IUserPayload = {
        email: value.email.trim(),
        name: value.name.trim(),
        roles: value.roles,
        ...(value.password && { password: value.password }),
        ...(value.avatar.trim() && { avatar: value.avatar.trim() }),
        ...(value.jobTitle.trim() && { jobTitle: value.jobTitle.trim() }),
        ...(value.socialLinks.trim() && { socialLinks: JSON.parse(value.socialLinks) as Record<string, string> })
      };
      this.dialogRef.close({
        payload
      });
    });
  }
}
