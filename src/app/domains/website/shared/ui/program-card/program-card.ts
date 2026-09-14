import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { IProgram } from '@/app/shared/interfaces';
import { environment } from '@/environments/environment';

@Component({
  selector: 'program-card',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './program-card.html'
})
export class ProgramCard {
  readonly program = input.required<IProgram>();

  protected readonly logoUrl = computed(() => {
    const logo = this.program().logo;
    return logo ? `${environment.apiUrl}/uploads/programs/${encodeURIComponent(logo)}` : '';
  });
}
