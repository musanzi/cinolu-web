import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import type { IRemoveParticipationDialogData } from '../../interfaces';

@Component({
  selector: 'app-remove-participation-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './remove-participation-dialog.html'
})
export class RemoveParticipationDialog {
  protected readonly data = inject<IRemoveParticipationDialogData>(MAT_DIALOG_DATA);
}
