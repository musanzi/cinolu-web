import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NETWORKS } from '../../data';

@Component({
  selector: 'networks',
  imports: [MatIconModule],
  templateUrl: './networks.html'
})
export class Networks {
  protected readonly networks = NETWORKS;
}
