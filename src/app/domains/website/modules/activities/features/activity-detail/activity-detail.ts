import { Clipboard } from '@angular/cdk/clipboard';
import { DatePipe, DOCUMENT } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { ReturnUrl } from '@/app/core/return-url';
import { durationLabel, endOfDay, hasEnded, isSameDay, timeRangeLabel } from '@/app/shared/helpers';
import { AuthStore } from '@/app/domains/auth/data-access';
import { Tab, Tabs } from '@/app/domains/website/shared/ui';
import { ParticipationsStore } from '@/app/domains/user/modules/participations/data-access';
import { IParticipationsResponse } from '@/app/domains/user/modules/participations/interfaces';
import { FormRenderer, Message } from '@/app/shared/ui';
import { IActivity } from '@/app/shared/interfaces';
import { environment } from '@/environments/environment';

@Component({
  selector: 'website-activity-detail',
  imports: [
    DatePipe,
    FormRenderer,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    Message,
    RouterLink,
    Tab,
    Tabs
  ],
  templateUrl: './activity-detail.html',
  providers: [ParticipationsStore]
})
export default class ActivityDetail {
  readonly slug = input.required<string>();

  private defaultTabApplied = false;
  protected readonly selectedTab = signal<string>('participation');

  protected readonly authStore = inject(AuthStore);
  protected readonly participationsStore = inject(ParticipationsStore);
  private readonly clipboard = inject(Clipboard);
  private readonly document = inject(DOCUMENT);
  private readonly participationRenderer = viewChild(FormRenderer);
  private readonly returnUrl = inject(ReturnUrl);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly activityResource = httpResource<IActivity>(() => {
    const slug = this.slug().trim();
    return slug ? `/activities/${encodeURIComponent(slug)}` : undefined;
  });
  protected readonly existingParticipationResource = httpResource<IParticipationsResponse>(() => {
    if (!this.authStore.user() || !this.activityResource.hasValue()) return undefined;

    const params = new URLSearchParams({
      page: '1',
      limit: '1',
      activityId: this.activityResource.value().id
    });
    return `/participations/mine?${params.toString()}`;
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
  protected readonly hasParticipationForm = computed(() =>
    this.participationForm().some((section) => section.fields.length > 0)
  );
  protected readonly hasActivityEnded = computed(() => {
    if (!this.activityResource.hasValue()) return false;

    const activity = this.activityResource.value();
    return isSameDay(activity.startDate, activity.endDate)
      ? hasEnded(endOfDay(activity.endDate))
      : hasEnded(activity.endDate);
  });
  protected readonly isSameDay = computed(() =>
    this.activityResource.hasValue()
      ? isSameDay(this.activityResource.value().startDate, this.activityResource.value().endDate)
      : false
  );
  protected readonly timeRangeLabel = computed(() =>
    this.activityResource.hasValue()
      ? timeRangeLabel(this.activityResource.value().startDate, this.activityResource.value().endDate)
      : ''
  );
  protected readonly durationLabel = computed(() =>
    this.activityResource.hasValue()
      ? durationLabel(this.activityResource.value().startDate, this.activityResource.value().endDate)
      : ''
  );
  protected readonly existingParticipation = computed(() =>
    this.existingParticipationResource.hasValue() ? this.existingParticipationResource.value()[0][0] : undefined
  );

  constructor() {
    effect(() => {
      if (!this.activityResource.hasValue() || this.defaultTabApplied) return;

      this.defaultTabApplied = true;
      this.selectedTab.set(this.hasActivityEnded() ? 'details' : 'participation');
    });
  }

  protected saveReturnUrl(): void {
    this.returnUrl.saveAttemptedUrl(this.router.url);
  }

  protected submitParticipation(event: Event): void {
    event.preventDefault();
    const renderer = this.participationRenderer();
    if (
      !renderer ||
      !this.activityResource.hasValue() ||
      !this.hasParticipationForm() ||
      this.hasActivityEnded() ||
      this.existingParticipationResource.isLoading() ||
      this.existingParticipationResource.error() ||
      this.existingParticipation()
    ) {
      return;
    }
    const activityId = this.activityResource.value().id;

    renderer.submit(async (responses) => {
      this.participationsStore.createParticipation({
        activityId,
        responses
      });
    });
  }

  protected async shareActivity(): Promise<void> {
    if (!this.activityResource.hasValue()) return;

    const browserWindow = this.document.defaultView;
    if (!browserWindow) return;

    const activity = this.activityResource.value();
    const url = browserWindow.location.href;

    try {
      if (browserWindow.navigator.share) {
        await browserWindow.navigator.share({
          title: activity.name,
          text: `Découvrez l'activité ${activity.name}.`,
          url
        });
        return;
      }

      this.copyActivityUrl(url);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      this.copyActivityUrl(url);
    }
  }

  protected avatarUrl(avatar: string): string {
    return avatar.startsWith('http') ? avatar : `${environment.apiUrl}/uploads/profiles/${encodeURIComponent(avatar)}`;
  }

  private copyActivityUrl(url: string): void {
    const copied = this.clipboard.copy(url);
    this.snackBar.open(copied ? "Lien de l'activité copié." : "Impossible de copier le lien de l'activité.", 'Fermer', {
      duration: 3500
    });
  }
}
