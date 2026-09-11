import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import type { IRemoveActivityDialogData } from '../../interfaces';

@Component({
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './remove-activity-dialog.html'
})
export class RemoveActivityDialog {
  protected readonly data = inject<IRemoveActivityDialogData>(MAT_DIALOG_DATA);
}
