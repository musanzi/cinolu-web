import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import type { IRemoveCohortDialogData } from '../../interfaces';

@Component({
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './remove-cohort-dialog.html'
})
export class RemoveCohortDialog {
  protected readonly data = inject<IRemoveCohortDialogData>(MAT_DIALOG_DATA);
}
