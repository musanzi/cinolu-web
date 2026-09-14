import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { IPortfolio } from '@/app/shared/interfaces';
import { environment } from '@/environments/environment';

@Component({
  selector: 'portfolio-card',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './portfolio-card.html'
})
export class PortfolioCard {
  readonly portfolio = input.required<IPortfolio>();

  protected readonly logoUrl = computed(() => {
    const logo = this.portfolio().logo;
    return logo ? `${environment.apiUrl}/uploads/portfolios/${encodeURIComponent(logo)}` : '';
  });
}
