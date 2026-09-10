import { DatePipe, KeyValuePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { IReview } from '@/app/shared/interfaces';

@Component({
  imports: [DatePipe, KeyValuePipe, MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './review-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ReviewDetails {
  readonly id = input.required<string>();
  protected readonly reviewResource = httpResource<IReview>(() => `/reviews/staff/${encodeURIComponent(this.id())}`);

  protected formatAnswer(value: unknown): string {
    if (Array.isArray(value)) return value.join(', ');
    if (value && typeof value === 'object') return JSON.stringify(value, null, 2);
    return value === undefined || value === null || value === '' ? 'No answer' : String(value);
  }
}
