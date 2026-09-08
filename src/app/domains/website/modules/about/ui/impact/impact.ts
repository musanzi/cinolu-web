import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { OUR_IMPACT_ITEMS } from '../../data/our-impact.data';

@Component({
  selector: 'about-impact',
  imports: [DecimalPipe, MatIconModule],
  templateUrl: './impact.html'
})
export class AboutImpact {
  protected readonly impactItems = OUR_IMPACT_ITEMS;
}
