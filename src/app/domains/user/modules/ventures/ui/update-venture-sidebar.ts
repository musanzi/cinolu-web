import { Component, input, output } from '@angular/core';
import type { ISector, IVenture } from '@/app/shared/interfaces';
import type { IVentureFormResult } from '../interfaces';
import { VentureForm } from './venture-form';

@Component({
  selector: 'update-venture-sidebar',
  imports: [VentureForm],
  templateUrl: './update-venture-sidebar.html'
})
export class UpdateVentureSidebar {
  readonly venture = input.required<IVenture>();
  readonly sectors = input.required<ISector[]>();
  readonly isSaving = input(false);
  readonly cancelled = output<void>();
  readonly submitted = output<IVentureFormResult>();
}
