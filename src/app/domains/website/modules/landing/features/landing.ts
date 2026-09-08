import { Component } from '@angular/core';
import { Hero } from '../ui/hero/hero';
import { Networks } from '../ui/networks/networks';
import { Partners } from '../ui/partners/partners';

@Component({
  selector: 'app-landing',
  imports: [Hero, Networks, Partners],
  templateUrl: './landing.html'
})
export class Landing {}
