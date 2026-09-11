import { Component, inject, signal } from '@angular/core';
import { FormField, form, maxLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ISectorDialogData, ISectorDialogResult, ISectorPayload } from '../../interfaces';

@Component({
  selector: 'app-sector-form-dialog',
  imports: [FormField, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './sector-form-dialog.html'
})
export class SectorFormDialog {
  protected readonly data = inject<ISectorDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SectorFormDialog, ISectorDialogResult>);
  protected readonly sectorModel = signal<ISectorPayload>({ name: this.data.sector?.name ?? '' });
  protected readonly sectorForm = form(this.sectorModel, (path) => {
    required(path.name, { message: 'Name is required.' });
    maxLength(path.name, 100, { message: 'Name cannot exceed 100 characters.' });
    validate(path.name, ({ value }) =>
      value().trim() ? undefined : { kind: 'whitespace', message: 'Name is required.' }
    );
  });
  protected onSubmit(): void {
    submit(this.sectorForm, async (formState) => {
      this.dialogRef.close({ payload: { name: formState().value().name.trim() } });
    });
  }
}
