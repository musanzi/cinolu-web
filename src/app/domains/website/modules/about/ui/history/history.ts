import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HISTORY_TIMELINE } from '../../data/history.data';

@Component({
  selector: 'about-history',
  imports: [MatIconModule],
  templateUrl: './history.html'
})
export class AboutHistory {
  protected readonly historyData = HISTORY_TIMELINE;
  protected readonly expandedMenu = signal<number | null>(null);

  protected toggleExpand(id: number): void {
    this.expandedMenu.update((current) => (current === id ? null : id));
  }
}
