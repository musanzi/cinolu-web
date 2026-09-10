import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { IRemoveNamedEntityDialogData } from '../../interfaces';

@Component({
  selector: 'app-remove-named-entity-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './remove-named-entity-dialog.html'
})
export class RemoveNamedEntityDialog {
  protected readonly data = inject<IRemoveNamedEntityDialogData>(MAT_DIALOG_DATA);
}
