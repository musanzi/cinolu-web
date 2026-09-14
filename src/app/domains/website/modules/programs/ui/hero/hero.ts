import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'programs-hero',
  imports: [MatIconModule, MatButton, RouterLink],
  templateUrl: './hero.html'
})
export class ProgramsHero {}
