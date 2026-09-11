import { Component, input, output } from '@angular/core';
import type { IRole } from '@/app/shared/interfaces';
import type { IUserPayload } from '../../interfaces';
import { UserForm } from '../user-form/user-form';

@Component({
  selector: 'add-user-sidebar',
  imports: [UserForm],
  host: {
    class: 'flex h-full min-h-0 flex-col'
  },
  templateUrl: './add-user-sidebar.html'
})
export class AddUserSidebar {
  readonly roles = input.required<IRole[]>();
  readonly isSaving = input(false);
  readonly cancelled = output<void>();
  readonly submitted = output<IUserPayload>();
}
