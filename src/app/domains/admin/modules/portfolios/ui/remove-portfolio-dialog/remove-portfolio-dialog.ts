import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { IRemovePortfolioDialogData } from '../../interfaces';

@Component({
  selector: 'app-remove-portfolio-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './remove-portfolio-dialog.html'
})
export class RemovePortfolioDialog {
  protected readonly data = inject<IRemovePortfolioDialogData>(MAT_DIALOG_DATA);
}
