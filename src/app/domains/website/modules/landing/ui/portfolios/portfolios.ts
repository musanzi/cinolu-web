import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { IPortfoliosResponse } from '../../interfaces';
import { PortfolioCard } from '@/app/domains/website/shared/ui';

@Component({
  selector: 'landing-portfolios',
  imports: [PortfolioCard, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './portfolios.html'
})
export class LandingPortfolios {
  protected readonly portfoliosResource = httpResource<IPortfoliosResponse>(() => '/portfolios');
  protected readonly skeletons = [0, 1, 2, 3, 4, 5];
}
