import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { IFormResponses, ParticipationData, ParticipationStatus } from '@/app/shared/interfaces';
import { Message } from '@/app/shared/ui';
import { environment } from '@/environments/environment';
import { ParticipationsStore } from '../../data-access/participations.store';
import type { IParticipationResponse } from '../../interfaces';

@Component({
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    Message,
    RouterLink
  ],
  templateUrl: './participation-detail.html',
  providers: [ParticipationsStore]
})
export default class ParticipationDetail {
  readonly id = input.required<string>();

  protected readonly store = inject(ParticipationsStore);
  protected readonly statuses = ParticipationStatus;

  protected readonly participationResource = httpResource<IParticipationResponse>(() => {
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
        value: this.formatResponse(responses[field.name])
      }))
    );
  });

  protected updateStatus(status: ParticipationStatus): void {
    if (!this.participationResource.hasValue()) return;
    this.store.updateParticipationStatus({ id: this.participationResource.value().id, status });
  }

  protected statusLabel(status: ParticipationStatus): string {    switch (status) {
      case ParticipationStatus.APPROVED:
        return 'Approved';
      case ParticipationStatus.DECLINED:
        return 'Declined';
      default:
        return 'Pending';
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

  protected coverUrl(participation: IParticipationResponse): string {
    const cover = participation.activity.cover;
    if (!cover) return '/images/projects.jpg';
    return cover.startsWith('http') ? cover : `${environment.apiUrl}/uploads/activities/${encodeURIComponent(cover)}`;
  }

  private formatResponse(value: string | string[] | undefined): string {
    if (Array.isArray(value)) return value.length ? value.join(', ') : 'No answer';
    return value || 'No answer';
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
