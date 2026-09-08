import { Component, signal } from '@angular/core';
import { TEAM_MEMBERS } from '../../data/our-team.data';
import { IMemberItem } from '../../interfaces';

@Component({
  selector: 'about-team',
  templateUrl: './team.html'
})
export class AboutTeam {
  protected readonly teamMembers = TEAM_MEMBERS;

  protected readonly selectedMember = signal<IMemberItem>(TEAM_MEMBERS[0]);

  protected selectMember(member: IMemberItem): void {
    this.selectedMember.set(member);
  }
}
