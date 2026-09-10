import { Component, inject, signal } from '@angular/core';
import { FormField, form, maxLength, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IProgramDialogData, IProgramDialogResult, IProgramFormModel } from '../interfaces';

@Component({
  selector: 'app-program-form-dialog',
  imports: [
    FormField,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './program-form-dialog.html'
})
export class ProgramFormDialog {
  protected readonly data = inject<IProgramDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ProgramFormDialog, IProgramDialogResult>);

  protected readonly selectedLogo = signal<File | undefined>(undefined);
  protected readonly programModel = signal<IProgramFormModel>({
    name: this.data.program?.name ?? '',
    description: this.data.program?.description ?? '',
    portfolioId: this.data.program?.portfolio.id ?? '',
    managers: this.data.program?.managers.map((manager) => manager.id) ?? []
  });

  protected readonly programForm = form(this.programModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required.' });
    maxLength(schemaPath.name, 150, { message: 'Name cannot exceed 150 characters.' });
    required(schemaPath.portfolioId, { message: 'Portfolio is required.' });
  });

  protected onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedLogo.set(input.files?.[0]);
  }

  protected clearLogo(input: HTMLInputElement): void {
    input.value = '';
    this.selectedLogo.set(undefined);
  }

  protected onSubmit(): void {
    submit(this.programForm, async (formState) => {
      const value = formState().value();
      this.dialogRef.close({
        payload: {
          name: value.name.trim(),
          description: value.description.trim(),
          portfolioId: value.portfolioId,
          managers: value.managers
        },
        logo: this.selectedLogo()
      });
    });
  }
}
