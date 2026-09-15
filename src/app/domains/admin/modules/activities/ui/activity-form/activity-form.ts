import { DOCUMENT } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, linkedSignal, output, signal } from '@angular/core';
import { FormField, form, maxLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { environment } from '@/environments/environment';
import type { IActivity, IForm } from '@/app/shared/interfaces';
import { FormBuilder } from '@/app/shared/ui/form-builder/form-builder';
import type {
  IActivityDetailsFormModel,
  IActivityFormResult,
  IActivityLookups,
  IActivityPayload
} from '../../interfaces';

@Component({
  selector: 'activity-form',
  imports: [
    FormBuilder,
    FormField,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule
  ],
  templateUrl: './activity-form.html'
})
export class ActivityForm {
  readonly heading = input.required<string>();
  readonly submitLabel = input.required<string>();
  readonly lookups = input.required<IActivityLookups>();
  readonly activity = input<IActivity>();
  readonly isSaving = input(false);
  readonly cancelled = output<void>();
  readonly submitted = output<IActivityFormResult>();

  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private objectUrl = '';

  protected readonly selectedCover = signal<File | undefined>(undefined);
  private readonly selectedCoverPreview = signal('');
  protected readonly coverPreview = computed(() => {
    if (this.selectedCoverPreview()) return this.selectedCoverPreview();
    const cover = this.activity()?.cover;
    if (!cover) return '';
    return cover.startsWith('http') ? cover : `${environment.apiUrl}/uploads/activities/${encodeURIComponent(cover)}`;
  });

  protected readonly activityModel = linkedSignal(() => this.createModel(this.activity()));
  protected readonly participationForm = linkedSignal(() =>
    this.cloneForm(this.activity()?.participationForm, 'Application')
  );
  protected readonly reviewForm = linkedSignal(() => this.cloneForm(this.activity()?.reviewForm, 'Review'));
  protected readonly isPublished = linkedSignal(() => this.activity()?.isPublished ?? false);

  protected readonly activityForm = form(this.activityModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required.' });
    maxLength(schemaPath.name, 150, { message: 'Name cannot exceed 150 characters.' });
    required(schemaPath.startDate, { message: 'Start date is required.' });
    required(schemaPath.endDate, { message: 'End date is required.' });
    required(schemaPath.programId, { message: 'Program is required.' });
    validate(schemaPath.name, ({ value }) => {
      if (!value().trim()) return { kind: 'whitespace', message: 'Name is required.' };
      return undefined;
    });
    validate(schemaPath.endDate, ({ value, valueOf }) => {
      const startDate = valueOf(schemaPath.startDate);
      const endDate = value();
      if (!(startDate instanceof Date) || !(endDate instanceof Date)) return undefined;
      if (endDate.getTime() < startDate.getTime()) {
        return { kind: 'dateOrder', message: 'End date must be after the start date.' };
      }
      return undefined;
    });
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.revokeObjectUrl());
  }

  protected onCoverSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const cover = inputElement.files?.[0];
    if (!cover) return;

    this.revokeObjectUrl();
    const urlApi = this.document.defaultView?.URL;
    if (urlApi) {
      this.objectUrl = urlApi.createObjectURL(cover);
      this.selectedCoverPreview.set(this.objectUrl);
    }
    this.selectedCover.set(cover);
  }

  protected clearSelectedCover(inputElement: HTMLInputElement): void {
    inputElement.value = '';
    this.revokeObjectUrl();
    this.selectedCover.set(undefined);
    this.selectedCoverPreview.set('');
  }

  protected onSubmit(): void {
    submit(this.activityForm, async (formState) => {
      const value = formState().value();
      const payload: IActivityPayload = {
        ...value,
        startDate: value.startDate.toISOString(),
        endDate: value.endDate.toISOString(),
        participationForm: this.participationForm(),
        isPublished: this.isPublished(),
        reviewForm: this.reviewForm()
      };
      this.submitted.emit({ payload, cover: this.selectedCover() });
    });
  }

  private revokeObjectUrl(): void {
    if (!this.objectUrl) return;
    this.document.defaultView?.URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = '';
  }

  private createModel(activity?: IActivity): IActivityDetailsFormModel {
    const startDate = activity?.startDate ? new Date(activity.startDate) : new Date();
    const endDate = activity?.endDate ? new Date(activity.endDate) : new Date(Date.now() + 60 * 60_000);

    return {
      name: activity?.name ?? '',
      description: activity?.description ?? '',
      startDate,
      endDate,
      programId: activity?.program.id ?? '',
      mentorIds: activity?.mentors.map((mentor) => mentor.id) ?? [],
      typeIds: activity?.types.map((type) => type.id) ?? [],
      categoryIds: activity?.categories.map((category) => category.id) ?? []
    };
  }

  private cloneForm(value: IForm[] | undefined, phase: string): IForm[] {
    if (!Array.isArray(value) || value.length === 0) return [{ phase, fields: [] }];

    return value.map((section) => ({
      ...section,
      fields: section.fields.map((field) => ({
        ...field,
        options: field.options?.map((option) => ({ ...option }))
      }))
    }));
  }
}
