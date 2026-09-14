import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { STATS } from '../../data';

@Component({
  selector: 'landing-stats',
  imports: [MatIcon],
  templateUrl: 'stats.html'
})
export class WhyJoinUs {
  stats = STATS;
}
