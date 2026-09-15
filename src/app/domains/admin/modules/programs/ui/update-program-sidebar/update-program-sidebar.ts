import { Component, input, output } from '@angular/core';
import type { IProgram } from '@/app/shared/interfaces';
import type { IProgramFormResult, IProgramLookups } from '../../interfaces';
import { ProgramForm } from '../program-form/program-form';

@Component({
  selector: 'update-program-sidebar',
  imports: [ProgramForm],
  templateUrl: './update-program-sidebar.html'
})
export class UpdateProgramSidebar {
  readonly program = input.required<IProgram>();
  readonly lookups = input.required<IProgramLookups>();
  readonly isSaving = input(false);
  readonly cancelled = output<void>();
  readonly submitted = output<IProgramFormResult>();
}
