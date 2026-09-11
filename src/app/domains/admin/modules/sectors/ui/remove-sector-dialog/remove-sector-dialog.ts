import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { IRemoveSectorDialogData } from '../../interfaces';

@Component({
  selector: 'app-remove-sector-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './remove-sector-dialog.html'
})
export class RemoveSectorDialog {
  protected readonly data = inject<IRemoveSectorDialogData>(MAT_DIALOG_DATA);
}
