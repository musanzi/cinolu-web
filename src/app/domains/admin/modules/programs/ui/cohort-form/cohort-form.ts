import { Component, input, linkedSignal, output } from '@angular/core';
import { FormField, form, maxLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import type { ICohort } from '@/app/shared/interfaces';

export interface ICohortFormResult {
  name: string;
}

@Component({
  selector: 'cohort-form',
  imports: [FormField, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './cohort-form.html'
})
export class CohortForm {
  readonly submitLabel = input.required<string>();
  readonly cohort = input<ICohort>();
  readonly isSaving = input(false);
  readonly cancelled = output<void>();
  readonly submitted = output<ICohortFormResult>();

  protected readonly cohortModel = linkedSignal<{ name: string }>(() => ({
    name: this.cohort()?.name ?? ''
  }));
  protected readonly cohortForm = form(this.cohortModel, (path) => {
    required(path.name, { message: 'Name is required.' });
    maxLength(path.name, 150, { message: 'Name cannot exceed 150 characters.' });
    validate(path.name, ({ value }) =>
      value().trim() ? undefined : { kind: 'whitespace', message: 'Name is required.' }
    );
  });

  protected onSubmit(): void {
    submit(this.cohortForm, async (formState) => {
      this.submitted.emit({ name: formState().value().name.trim() });
    });
  }
}
