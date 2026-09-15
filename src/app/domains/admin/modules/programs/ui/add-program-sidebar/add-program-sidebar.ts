import { Component, input, output } from '@angular/core';
import type { IProgramFormResult, IProgramLookups } from '../../interfaces';
import { ProgramForm } from '../program-form/program-form';

@Component({
  selector: 'add-program-sidebar',
  imports: [ProgramForm],
  templateUrl: './add-program-sidebar.html'
})
export class AddProgramSidebar {
  readonly lookups = input.required<IProgramLookups>();
  readonly isSaving = input(false);
  readonly cancelled = output<void>();
  readonly submitted = output<IProgramFormResult>();
}
