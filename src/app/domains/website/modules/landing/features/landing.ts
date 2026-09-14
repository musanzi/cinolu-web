import { Component } from '@angular/core';
import { LandingHero } from '../ui/hero/hero';
import { LandingNetworks } from '../ui/networks/networks';
import { LandingPartners } from '../ui/partners/partners';
import { LandingPortfolios } from '../ui/portfolios/portfolios';
import { LandingRecentActivities } from '../ui/recent-activities/recent-activities';
import { LandingRecentPrograms } from '../ui/recent-programs/recent-programs';
import { WhyJoinUs } from '../ui/stats/stats';

@Component({
  selector: 'app-landing',
  imports: [
    LandingHero,
    LandingNetworks,
    LandingPartners,
    LandingPortfolios,
    LandingRecentActivities,
    LandingRecentPrograms,
    WhyJoinUs
  ],
  templateUrl: './landing.html'
})
export class Landing {}
