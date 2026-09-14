import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import type { IRemoveVentureDialogData } from '../interfaces';

@Component({
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './remove-venture-dialog.html'
})
export class RemoveVentureDialog {
  protected readonly data = inject<IRemoveVentureDialogData>(MAT_DIALOG_DATA);
}
