import { DOCUMENT } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, linkedSignal, output, signal } from '@angular/core';
import { FormField, form, maxLength, minLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import type { ISector, IVenture } from '@/app/shared/interfaces';
import { VentureStage } from '@/app/shared/interfaces';
import { environment } from '@/environments/environment';
import type { IVentureFilterOption, IVentureFormModel, IVentureFormResult } from '../interfaces';

@Component({
  selector: 'venture-form',
  imports: [FormField, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule],
  templateUrl: './venture-form.html'
})
export class VentureForm {
  readonly heading = input.required<string>();
  readonly submitLabel = input.required<string>();
  readonly sectors = input.required<ISector[]>();
  readonly venture = input<IVenture>();
  readonly isSaving = input(false);
  readonly cancelled = output<void>();
  readonly submitted = output<IVentureFormResult>();

  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private logoObjectUrl = '';
  private coverObjectUrl = '';

  protected readonly stageOptions: IVentureFilterOption<VentureStage>[] = [
    { value: VentureStage.IDEA, label: 'Idée' },
    { value: VentureStage.MVP, label: 'MVP' },
    { value: VentureStage.EARLY_STAGE, label: 'Premiers clients' },
    { value: VentureStage.GROWTH, label: 'Croissance' },
    { value: VentureStage.MATURE, label: 'Maturité' }
  ];
  protected readonly selectedLogo = signal<File | undefined>(undefined);
  protected readonly selectedCover = signal<File | undefined>(undefined);
  private readonly selectedLogoPreview = signal('');
  private readonly selectedCoverPreview = signal('');
  protected readonly logoPreview = computed(() => this.selectedLogoPreview() || this.imageUrl(this.venture()?.logo));
  protected readonly coverPreview = computed(() => this.selectedCoverPreview() || this.imageUrl(this.venture()?.cover));
  protected readonly ventureModel = linkedSignal<IVentureFormModel>(() => this.createModel(this.venture()));
  protected readonly ventureForm = form(this.ventureModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Le nom est obligatoire.' });
    maxLength(schemaPath.name, 150, { message: 'Le nom ne peut pas dépasser 150 caractères.' });
    required(schemaPath.description, { message: 'La description est obligatoire.' });
    minLength(schemaPath.sectorIds, 1, { message: 'Sélectionnez au moins un secteur.' });
    validate(schemaPath.name, ({ value }) =>
      value().trim() ? undefined : { kind: 'whitespace', message: 'Le nom est obligatoire.' }
    );
    validate(schemaPath.description, ({ value }) =>
      value().trim() ? undefined : { kind: 'whitespace', message: 'La description est obligatoire.' }
    );
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.revokeObjectUrl('logo');
      this.revokeObjectUrl('cover');
    });
  }

  protected onImageSelected(event: Event, field: 'logo' | 'cover'): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.revokeObjectUrl(field);
    const objectUrl = this.document.defaultView?.URL.createObjectURL(file) ?? '';
    if (field === 'logo') {
      this.logoObjectUrl = objectUrl;
      this.selectedLogo.set(file);
      this.selectedLogoPreview.set(objectUrl);
      return;
    }
    this.coverObjectUrl = objectUrl;
    this.selectedCover.set(file);
    this.selectedCoverPreview.set(objectUrl);
  }

  protected onSubmit(): void {
    submit(this.ventureForm, async (formState) => {
      const value = formState().value();
      const socials = {
        ...this.venture()?.socials,
        website: value.website.trim(),
        linkedin: value.linkedin.trim(),
        facebook: value.facebook.trim(),
        instagram: value.instagram.trim()
      };

      this.submitted.emit({
        payload: {
          name: value.name.trim(),
          description: value.description.trim(),
          stage: value.stage,
          sectorIds: value.sectorIds,
          socials: Object.fromEntries(Object.entries(socials).filter(([, url]) => url.length > 0))
        },
        logo: this.selectedLogo(),
        cover: this.selectedCover()
      });
    });
  }

  private createModel(venture?: IVenture): IVentureFormModel {
    return {
      name: venture?.name ?? '',
      description: venture?.description ?? '',
      stage: venture?.stage ?? VentureStage.IDEA,
      sectorIds: venture?.sectors.map((sector) => sector.id) ?? [],
      website: venture?.socials['website'] ?? '',
      linkedin: venture?.socials['linkedin'] ?? '',
      facebook: venture?.socials['facebook'] ?? '',
      instagram: venture?.socials['instagram'] ?? ''
    };
  }

  private imageUrl(image?: string): string {
    if (!image) return '';
    return image.startsWith('http') ? image : `${environment.apiUrl}/uploads/ventures/${encodeURIComponent(image)}`;
  }

  private revokeObjectUrl(field: 'logo' | 'cover'): void {
    const objectUrl = field === 'logo' ? this.logoObjectUrl : this.coverObjectUrl;
    if (!objectUrl) return;
    this.document.defaultView?.URL.revokeObjectURL(objectUrl);
    if (field === 'logo') this.logoObjectUrl = '';
    else this.coverObjectUrl = '';
  }
}
