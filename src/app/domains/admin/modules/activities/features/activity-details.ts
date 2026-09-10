import { httpResource } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { IActivity } from '@/app/shared/interfaces';

@Component({
  imports: [DatePipe, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, RouterLink],
  templateUrl: './activity-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ActivityDetails {
  readonly slug = input.required<string>();
  protected readonly activityResource = httpResource<IActivity>(() => `/activities/${encodeURIComponent(this.slug())}`);
}
