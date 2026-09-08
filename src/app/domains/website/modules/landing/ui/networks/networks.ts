import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NETWORKS } from '../../data';

@Component({
  selector: 'landing-networks',
  imports: [MatIconModule],
  templateUrl: './networks.html'
})
export class LandingNetworks {
  protected readonly networks = NETWORKS;
}
