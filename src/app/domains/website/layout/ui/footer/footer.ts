import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NAVIGATION_LINKS } from '../../data/navigation';

@Component({
  selector: 'website-footer',
  imports: [RouterLink, MatIconModule],
  templateUrl: './footer.html'
})
export class WebsiteFooter {
  protected readonly links = NAVIGATION_LINKS;
  protected readonly currentYear = new Date().getFullYear();
}
