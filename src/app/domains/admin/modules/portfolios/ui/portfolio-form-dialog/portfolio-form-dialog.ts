import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormField, form, maxLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { environment } from '@/environments/environment';
import { IPortfolioDialogData, IPortfolioDialogResult, IPortfolioPayload } from '../../interfaces';

@Component({
  imports: [FormField, MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './portfolio-form-dialog.html'
})
export class PortfolioFormDialog {
  protected readonly data = inject<IPortfolioDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<PortfolioFormDialog, IPortfolioDialogResult>);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private objectUrl = '';

  protected readonly selectedLogo = signal<File | undefined>(undefined);
  protected readonly logoPreview = signal(
    this.data.portfolio?.logo ? `${environment.apiUrl}/uploads/porfolios/${this.data.portfolio.logo}` : ''
  );
  protected readonly portfolioModel = signal<IPortfolioPayload>({
    name: this.data.portfolio?.name ?? '',
    description: this.data.portfolio?.description ?? ''
  });
  protected readonly portfolioForm = form(this.portfolioModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required.' });
    required(schemaPath.description, { message: 'Description is required.' });
    maxLength(schemaPath.name, 150, { message: 'Name cannot exceed 150 characters.' });
    validate(schemaPath.name, ({ value }) => {
      if (value().trim().length === 0) {
        return { kind: 'whitespace', message: 'Name is required.' };
      }
      return undefined;
    });
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.revokeObjectUrl());
  }

  protected onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const logo = input.files?.[0];
    if (!logo) return;

    this.revokeObjectUrl();
    const urlApi = this.document.defaultView?.URL;
    if (urlApi) {
      this.objectUrl = urlApi.createObjectURL(logo);
      this.logoPreview.set(this.objectUrl);
    }
    this.selectedLogo.set(logo);
  }

  protected onSubmit(): void {
    submit(this.portfolioForm, async (formState) => {
      const value = formState().value();
      this.dialogRef.close({
        payload: { name: value.name.trim(), description: value.description.trim() },
        logo: this.selectedLogo()
      });
    });
  }

  private revokeObjectUrl(): void {
    if (!this.objectUrl) return;

    this.document.defaultView?.URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = '';
  }
}
