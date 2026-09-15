import { Component, input, linkedSignal, output, signal } from '@angular/core';
import { FormField, form, maxLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import type { IProgram } from '@/app/shared/interfaces';
import type { IProgramFormModel, IProgramFormResult, IProgramLookups } from '../../interfaces';

@Component({
  selector: 'program-form',
  imports: [FormField, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule],
  templateUrl: './program-form.html'
})
export class ProgramForm {
  readonly heading = input.required<string>();
  readonly submitLabel = input.required<string>();
  readonly lookups = input.required<IProgramLookups>();
  readonly program = input<IProgram>();
  readonly isSaving = input(false);
  readonly cancelled = output<void>();
  readonly submitted = output<IProgramFormResult>();

  protected readonly selectedLogo = signal<File | undefined>(undefined);
  protected readonly programModel = linkedSignal(() => this.createModel(this.program()));
  protected readonly programForm = form(this.programModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required.' });
    maxLength(schemaPath.name, 150, { message: 'Name cannot exceed 150 characters.' });
    required(schemaPath.portfolioId, { message: 'Portfolio is required.' });
    validate(schemaPath.name, ({ value }) => {
      if (!value().trim()) return { kind: 'whitespace', message: 'Name is required.' };
      return undefined;
    });
  });

  protected onLogoSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedLogo.set(inputElement.files?.[0]);
  }

  protected clearLogo(inputElement: HTMLInputElement): void {
    inputElement.value = '';
    this.selectedLogo.set(undefined);
  }

  protected onSubmit(): void {
    submit(this.programForm, async (formState) => {
      const value = formState().value();
      this.submitted.emit({
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

  private createModel(program?: IProgram): IProgramFormModel {
    return {
      name: program?.name ?? '',
      description: program?.description ?? '',
      portfolioId: program?.portfolio.id ?? '',
      managers: program?.managers.map((manager) => manager.id) ?? []
    };
  }
}
