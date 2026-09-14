import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { IActivity } from '@/app/shared/interfaces';
import { environment } from '@/environments/environment';

@Component({
  selector: 'activity-card',
  imports: [DatePipe, MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './activity-card.html'
})
export class ActivityCard {
  readonly activity = input.required<IActivity>();

  protected readonly coverUrl = computed(() => {
    const cover = this.activity().cover;
    if (!cover) return '';
    return cover.startsWith('http') ? cover : `${environment.apiUrl}/uploads/activities/${encodeURIComponent(cover)}`;
  });
}
