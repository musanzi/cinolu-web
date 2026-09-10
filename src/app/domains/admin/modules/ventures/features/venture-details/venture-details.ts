import { KeyValuePipe, TitleCasePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { IVenture } from '@/app/shared/interfaces';
import { environment } from '@/environments/environment';

@Component({
  imports: [KeyValuePipe, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, RouterLink, TitleCasePipe],
  templateUrl: './venture-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class VentureDetails {
  readonly id = input.required<string>();
  protected readonly ventureResource = httpResource<IVenture>(() => `/ventures/staff/${encodeURIComponent(this.id())}`);

  protected assetUrl(asset: string): string {
    return asset.startsWith('http') ? asset : `${environment.apiUrl}/uploads/ventures/${encodeURIComponent(asset)}`;
  }

  protected hideBrokenImage(event: Event): void {
    (event.target as HTMLImageElement).hidden = true;
  }
}
