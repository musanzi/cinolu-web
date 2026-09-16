import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-card',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './auth-card.html'
})
export class AuthCard {
  protected readonly team = [
    { name: 'Berry Numbi', image: '/images/team/bn.webp' },
    { name: 'Josué Vangu', image: '/images/team/jv.webp' },
    { name: 'Rodriguez Monga', image: '/images/team/rm.webp' }
  ];
}
