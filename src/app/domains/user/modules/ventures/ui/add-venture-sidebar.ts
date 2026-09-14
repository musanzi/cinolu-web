import { Component, input, output } from '@angular/core';
import type { ISector } from '@/app/shared/interfaces';
import type { IVentureFormResult } from '../interfaces';
import { VentureForm } from './venture-form';

@Component({
  selector: 'add-venture-sidebar',
  imports: [VentureForm],
  templateUrl: './add-venture-sidebar.html'
})
export class AddVentureSidebar {
  readonly sectors = input.required<ISector[]>();
  readonly isSaving = input(false);
  readonly cancelled = output<void>();
  readonly submitted = output<IVentureFormResult>();
}
