import { Component, inject, signal } from '@angular/core';
import { FormField, form, maxLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { INamedEntityDialogData, INamedEntityDialogResult, INamedEntityPayload } from '../../interfaces';

@Component({
  selector: 'app-named-entity-form-dialog',
  imports: [FormField, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './named-entity-form-dialog.html'
})
export class NamedEntityFormDialog {
  protected readonly data = inject<INamedEntityDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<NamedEntityFormDialog, INamedEntityDialogResult>);

  protected readonly model = signal<INamedEntityPayload>({ name: this.data.entity?.name ?? '' });
  protected readonly entityForm = form(this.model, (path) => {
    required(path.name, { message: 'Name is required.' });
    maxLength(path.name, 100, { message: 'Name cannot exceed 100 characters.' });
    validate(path.name, ({ value }) =>
      value().trim() ? undefined : { kind: 'whitespace', message: 'Name is required.' }
    );
  });

  protected onSubmit(): void {
    submit(this.entityForm, async (formState) => {
      this.dialogRef.close({ payload: { name: formState().value().name.trim() } });
    });
  }
}
