import { Component, input, output } from '@angular/core';
import { IActivityFormResult, IActivityLookups } from '../../interfaces';
import { ActivityForm } from '../activity-form/activity-form';

@Component({
  imports: [ActivityForm],
  templateUrl: './add-activity-sidebar.html'
})
export class AddActivitySidebar {
  readonly lookups = input.required<IActivityLookups>();
  readonly isSaving = input(false);
  readonly cancelled = output<void>();
  readonly submitted = output<IActivityFormResult>();
}
