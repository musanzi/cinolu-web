import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { IRemoveProgramDialogData } from '../../interfaces';

@Component({
  selector: 'app-remove-program-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './remove-program-dialog.html'
})
export class RemoveProgramDialog {
  protected readonly data = inject<IRemoveProgramDialogData>(MAT_DIALOG_DATA);
}
