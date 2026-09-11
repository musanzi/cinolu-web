import { Component, input, output } from '@angular/core';
import { IActivity } from '@/app/shared/interfaces';
import { IActivityFormResult, IActivityLookups } from '../../interfaces';
import { ActivityForm } from '../activity-form/activity-form';

@Component({
  selector: 'update-activity-sidebar',
  imports: [ActivityForm],
  host: {
    class: 'flex h-full min-h-0 flex-col'
  },
  templateUrl: './update-activity-sidebar.html'
})
export class UpdateActivitySidebar {
  readonly activity = input.required<IActivity>();
  readonly lookups = input.required<IActivityLookups>();
  readonly isSaving = input(false);
  readonly cancelled = output<void>();
  readonly submitted = output<IActivityFormResult>();
}
