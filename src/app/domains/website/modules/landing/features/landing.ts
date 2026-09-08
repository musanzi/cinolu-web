import { Component } from '@angular/core';
import { LandingHero } from '../ui/hero/hero';
import { LandingNetworks } from '../ui/networks/networks';
import { LandingPartners } from '../ui/partners/partners';

@Component({
  selector: 'app-landing',
  imports: [LandingHero, LandingNetworks, LandingPartners],
  templateUrl: './landing.html'
})
export class Landing {}
