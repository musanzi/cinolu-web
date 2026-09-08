import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'hero',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './hero.html'
})
export class Hero {
  protected readonly stats = [
    { value: 500, label: 'Entrepreneurs accompagnés' },
    { value: 30, label: 'Partenaires actifs' }
  ];
}
