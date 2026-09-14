import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'activities-hero',
  imports: [MatIconModule, RouterLink, MatButton],
  templateUrl: './hero.html'
})
export class ActivitiesHero {}
