import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PARTNERS } from '../../data';
import { IPartner } from '../../interfaces';

@Component({
  selector: 'partners',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './partners.html',
  styleUrl: './partners.css'
})
export class Partners {
  protected readonly partners = PARTNERS;
  protected readonly firstRowDuplicated: IPartner[];
  protected readonly secondRowDuplicated: IPartner[];

  constructor() {
    const mid = Math.ceil(this.partners.length / 2);
    const firstRow = this.partners.slice(0, mid);
    const secondRow = this.partners.slice(mid);
    this.firstRowDuplicated = [...firstRow, ...firstRow];
    this.secondRowDuplicated = [...secondRow, ...secondRow];
  }
}
