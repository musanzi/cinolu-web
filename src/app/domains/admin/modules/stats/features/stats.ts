import { httpResource } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { IStat } from '../interfaces';

@Component({
  templateUrl: './stats.html',
  imports: [DecimalPipe, MatButtonModule, MatCardModule, MatIconModule]
})
export default class Stats {
  protected readonly statsResource = httpResource<IStat[]>(() => '/stats');
}
