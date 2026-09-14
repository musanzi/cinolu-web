import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, input, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@/app/domains/auth/data-access';
import { ParticipationsStore } from '@/app/domains/user/modules/participations/data-access';
import { FormRenderer, Message } from '@/app/shared/ui';
import type { IActivity } from '@/app/shared/interfaces';
import { environment } from '@/environments/environment';

@Component({
  selector: 'website-activity-detail',
  imports: [DatePipe, FormRenderer, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, Message, RouterLink],
  templateUrl: './activity-detail.html',
  providers: [ParticipationsStore]
})
export default class ActivityDetail {
  readonly slug = input.required<string>();

  protected readonly authStore = inject(AuthStore);
  protected readonly participationsStore = inject(ParticipationsStore);
  private readonly participationRenderer = viewChild(FormRenderer);

  protected readonly activityResource = httpResource<IActivity>(() => {
    const slug = this.slug().trim();
    return slug ? `/activities/${encodeURIComponent(slug)}` : undefined;
  });

  protected readonly coverUrl = computed(() => {
    if (!this.activityResource.hasValue()) return '/images/projects.jpg';

    const cover = this.activityResource.value().cover;
    if (!cover) return '/images/projects.jpg';
    return cover.startsWith('http') ? cover : `${environment.apiUrl}/uploads/activities/${encodeURIComponent(cover)}`;
  });

  protected readonly participationForm = computed(() => {
    if (!this.activityResource.hasValue()) return [];

    const form = this.activityResource.value().participationForm;
    return Array.isArray(form) ? form : [];
  });

  protected submitParticipation(event: Event): void {
    event.preventDefault();
    const renderer = this.participationRenderer();
    if (!renderer || !this.activityResource.hasValue()) return;
    const activityId = this.activityResource.value().id;

    renderer.submit(async (responses) => {
      this.participationsStore.createParticipation({
        activityId,
        responses
      });
    });
  }

  protected avatarUrl(avatar: string): string {
    return avatar.startsWith('http') ? avatar : `${environment.apiUrl}/uploads/profiles/${encodeURIComponent(avatar)}`;
  }
}
