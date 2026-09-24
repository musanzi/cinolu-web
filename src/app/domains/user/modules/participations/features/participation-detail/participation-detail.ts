import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, input, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { IField, IFormResponses, IParticipation, ParticipationData, ParticipationStatus } from '@/app/shared/interfaces';
import { FormRenderer, Message } from '@/app/shared/ui';
import { environment } from '@/environments/environment';
import { ParticipationsStore } from '../../data-access';

@Component({
  imports: [DatePipe, FormRenderer, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, Message, RouterLink],
  templateUrl: './participation-detail.html',
  providers: [ParticipationsStore]
})
export default class ParticipationDetail {
  readonly id = input.required<string>();

  protected readonly store = inject(ParticipationsStore);
  private readonly participationRenderer = viewChild(FormRenderer);
  protected readonly pendingStatus = ParticipationStatus.PENDING;

  protected readonly participationResource = httpResource<IParticipation>(() => {
    this.store.mutationVersion();
    const id = this.id().trim();
    return id ? `/participations/${encodeURIComponent(id)}` : undefined;
  });

  protected readonly participationResponses = computed<IFormResponses>(() => {
    if (!this.participationResource.hasValue()) return {};
    return this.parseResponses(this.participationResource.value().data);
  });

  protected readonly responseRows = computed(() => {
    if (!this.participationResource.hasValue()) return [];
    const participation = this.participationResource.value();
    const responses = this.participationResponses();
    return participation.activity.participationForm.flatMap((section) =>
      section.fields.map((field) => ({
        label: field.label,
        value: this.formatResponse(field, responses[field.name])
      }))
    );
  });

  protected updateParticipation(event: Event): void {
    event.preventDefault();
    const renderer = this.participationRenderer();
    if (!renderer || !this.participationResource.hasValue()) return;

    const participation = this.participationResource.value();
    renderer.submit(async (responses) => {
      this.store.updateParticipation({ id: participation.id, responses });
    });
  }

  protected statusLabel(status: ParticipationStatus): string {
    switch (status) {
      case ParticipationStatus.APPROVED:
        return 'Approuvée';
      case ParticipationStatus.DECLINED:
        return 'Refusée';
      default:
        return 'En attente';
    }
  }

  protected statusClasses(status: ParticipationStatus): string {
    switch (status) {
      case ParticipationStatus.APPROVED:
        return 'border-emerald-200 bg-emerald-50 text-emerald-800';
      case ParticipationStatus.DECLINED:
        return 'border-red-200 bg-red-50 text-red-800';
      default:
        return 'border-amber-200 bg-amber-50 text-amber-800';
    }
  }

  protected coverUrl(participation: IParticipation): string {
    const cover = participation.activity.cover;
    if (!cover) return '/images/projects.jpg';
    return cover.startsWith('http') ? cover : `${environment.apiUrl}/uploads/activities/${encodeURIComponent(cover)}`;
  }

  private formatResponse(field: IField, value: string | string[] | undefined): string {
    const resolve = (item: string): string =>
      field.options?.find((option) => option.value === item || option.label === item)?.label ?? item;
    if (Array.isArray(value)) return value.length ? value.map(resolve).join(', ') : 'Aucune réponse';
    return value ? resolve(value) : 'Aucune réponse';
  }

  private parseResponses(data: ParticipationData): IFormResponses {
    if (typeof data !== 'string') return data;

    try {
      const parsed: unknown = JSON.parse(data);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

      const responses: IFormResponses = {};
      for (const [name, value] of Object.entries(parsed)) {
        if (typeof value === 'string' || (Array.isArray(value) && value.every((item) => typeof item === 'string'))) {
          responses[name] = value;
        }
      }
      return responses;
    } catch {
      return {};
    }
  }
}
