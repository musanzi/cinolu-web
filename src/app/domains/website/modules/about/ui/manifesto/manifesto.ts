import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'about-manifesto',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './manifesto.html'
})
export class AboutManifesto {}
