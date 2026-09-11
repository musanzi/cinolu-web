import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { IRemoveCategoryDialogData } from '../../interfaces';

@Component({
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './remove-category-dialog.html'
})
export class RemoveCategoryDialog {
  protected readonly data = inject<IRemoveCategoryDialogData>(MAT_DIALOG_DATA);
}
