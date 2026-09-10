import { DatePipe, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { IUserResponse } from '../../interfaces';

@Component({
  imports: [
    DatePipe,
    KeyValuePipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    RouterLink,
    TitleCasePipe
  ],
  templateUrl: './user-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class UserDetails {
  readonly email = input.required<string>();
  protected readonly userResource = httpResource<IUserResponse>(() => `/users/${encodeURIComponent(this.email())}`);
}
