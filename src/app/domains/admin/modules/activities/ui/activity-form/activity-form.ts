import { DOCUMENT } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, DestroyRef, effect, inject, input, linkedSignal, output, signal } from '@angular/core';
import { FormField, form, maxLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MAT_TIMEPICKER_CONFIG, MatTimepickerModule } from '@angular/material/timepicker';
import { environment } from '@/environments/environment';
import { atTime, combineDateAndTime } from '@/app/shared/helpers';
import type { IActivity, IForm } from '@/app/shared/interfaces';
import { FormBuilder } from '@/app/shared/ui/form-builder/form-builder';
import { ResourcesEditor } from '../resources-editor/resources-editor';
import type {
  IActivityDetailsFormModel,
  IActivityFormResult,
  IActivityLookups,
  IActivityPayload,
  IActivityResource,
  ICohortsLookupResponse
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
    MatTabsModule,
    MatTimepickerModule,
    ResourcesEditor
  ],
  templateUrl: './activity-form.html',
  providers: [{ provide: MAT_TIMEPICKER_CONFIG, useValue: { interval: 15 } }]
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
  protected readonly resources = linkedSignal<IActivityResource[]>(() =>
    (this.activity()?.resources ?? []).map((resource) => ({ ...resource }))
  );
  protected readonly isPublished = linkedSignal(() => this.activity()?.isPublished ?? false);

  protected readonly activityForm = form(this.activityModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required.' });
    maxLength(schemaPath.name, 150, { message: 'Name cannot exceed 150 characters.' });
    required(schemaPath.startDate, { message: 'Start date is required.' });
    required(schemaPath.endDate, { message: 'End date is required.' });
    required(schemaPath.startTime, { message: 'Start time is required.' });
    required(schemaPath.endTime, { message: 'End time is required.' });
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
    validate(schemaPath.endTime, ({ value, valueOf }) => {
      const start = combineDateAndTime(valueOf(schemaPath.startDate), valueOf(schemaPath.startTime));
      const end = combineDateAndTime(valueOf(schemaPath.endDate), value());
      if (!(start instanceof Date) || !(end instanceof Date)) return undefined;
      if (end.getTime() <= start.getTime()) {
        return { kind: 'timeOrder', message: 'End time must be after the start time.' };
      }
      return undefined;
    });
  });

  protected readonly cohortsResource = httpResource<ICohortsLookupResponse>(() => {
    const programId = this.activityForm.programId().value();
    if (!programId) return undefined;
    return `/cohorts?programId=${programId}&page=1&limit=100`;
  });
  protected readonly cohorts = computed(() =>
    this.cohortsResource.hasValue() ? this.cohortsResource.value()[0] : []
  );
  private previousProgramId = this.activityModel().programId;

  constructor() {
    this.destroyRef.onDestroy(() => this.revokeObjectUrl());

    effect(() => {
      const programId = this.activityForm.programId().value();
      if (programId === this.previousProgramId) return;
      this.previousProgramId = programId;
      this.activityForm.cohortId().value.set('');
    });
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
      const { startTime, endTime, ...value } = formState().value();
      const payload: IActivityPayload = {
        ...value,
        startDate: combineDateAndTime(value.startDate, startTime).toISOString(),
        endDate: combineDateAndTime(value.endDate, endTime).toISOString(),
        participationForm: this.participationForm(),
        isPublished: this.isPublished(),
        reviewForm: this.reviewForm(),
        resources: this.resources()
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
    const endDate = activity?.endDate ? new Date(activity.endDate) : new Date(startDate);
    const startTime = activity?.startDate ? new Date(activity.startDate) : atTime(startDate, 9, 0);
    const endTime = activity?.endDate ? new Date(activity.endDate) : atTime(endDate, 10, 0);

    return {
      name: activity?.name ?? '',
      description: activity?.description ?? '',
      startDate,
      startTime,
      endDate,
      endTime,
      programId: activity?.program.id ?? '',
      cohortId: activity?.cohorts?.[0]?.id ?? '',
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
