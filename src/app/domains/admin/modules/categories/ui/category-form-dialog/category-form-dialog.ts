import { Component, inject, signal } from '@angular/core';
import { FormField, form, maxLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ICategoryDialogData, ICategoryDialogResult, ICategoryPayload } from '../../interfaces';

@Component({
  selector: 'app-category-form-dialog',
  imports: [FormField, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './category-form-dialog.html'
})
export class CategoryFormDialog {
  protected readonly data = inject<ICategoryDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CategoryFormDialog, ICategoryDialogResult>);

  protected readonly categoryModel = signal<ICategoryPayload>({ name: this.data.category?.name ?? '' });
  protected readonly categoryForm = form(this.categoryModel, (path) => {
    required(path.name, { message: 'Name is required.' });
    maxLength(path.name, 100, { message: 'Name cannot exceed 100 characters.' });
    validate(path.name, ({ value }) =>
      value().trim() ? undefined : { kind: 'whitespace', message: 'Name is required.' }
    );
  });

  protected onSubmit(): void {
    submit(this.categoryForm, async (formState) => {
      this.dialogRef.close({ payload: { name: formState().value().name.trim() } });
    });
  }
}
