import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { IRemoveTypeDialogData } from '../../interfaces';

@Component({
  selector: 'app-remove-type-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './remove-type-dialog.html'
})
export class RemoveTypeDialog {
  protected readonly data = inject<IRemoveTypeDialogData>(MAT_DIALOG_DATA);
}
