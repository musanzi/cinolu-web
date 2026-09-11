import { Component, input, output } from '@angular/core';
import { IActivity } from '@/app/shared/interfaces';
import { IActivityFormResult, IActivityLookups } from '../../interfaces';
import { ActivityForm } from '../activity-form/activity-form';

@Component({
  imports: [ActivityForm],
  templateUrl: './update-activity-sidebar.html'
})
export class UpdateActivitySidebar {
  readonly activity = input.required<IActivity>();
  readonly lookups = input.required<IActivityLookups>();
  readonly isSaving = input(false);
  readonly cancelled = output<void>();
  readonly submitted = output<IActivityFormResult>();
}
