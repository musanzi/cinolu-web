import { Component, inject, signal } from '@angular/core';
import { FormField, form, maxLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ITypeDialogData, ITypeDialogResult, ITypePayload } from '../../interfaces';

@Component({
  imports: [FormField, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './type-form-dialog.html'
})
export class TypeFormDialog {
  protected readonly data = inject<ITypeDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<TypeFormDialog, ITypeDialogResult>);

  protected readonly typeModel = signal<ITypePayload>({ name: this.data.type?.name ?? '' });
  protected readonly typeForm = form(this.typeModel, (path) => {
    required(path.name, { message: 'Name is required.' });
    maxLength(path.name, 100, { message: 'Name cannot exceed 100 characters.' });
    validate(path.name, ({ value }) =>
      value().trim() ? undefined : { kind: 'whitespace', message: 'Name is required.' }
    );
  });

  protected onSubmit(): void {
    submit(this.typeForm, async (formState) => {
      this.dialogRef.close({ payload: { name: formState().value().name.trim() } });
    });
  }
}
