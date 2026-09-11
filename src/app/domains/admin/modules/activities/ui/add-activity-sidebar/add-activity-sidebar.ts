import { Component, input, output } from '@angular/core';
import { IActivityFormResult, IActivityLookups } from '../../interfaces';
import { ActivityForm } from '../activity-form/activity-form';

@Component({
  selector: 'add-activity-sidebar',
  imports: [ActivityForm],
  host: {
    class: 'flex h-full min-h-0 flex-col'
  },
  templateUrl: './add-activity-sidebar.html'
})
export class AddActivitySidebar {
  readonly lookups = input.required<IActivityLookups>();
  readonly isSaving = input(false);
  readonly cancelled = output<void>();
  readonly submitted = output<IActivityFormResult>();
}
