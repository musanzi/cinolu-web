import { Component, input, output } from '@angular/core';
import type { IRole } from '@/app/shared/interfaces';
import type { IUserPayload, IUserRow } from '../../interfaces';
import { UserForm } from '../user-form/user-form';

@Component({
  selector: 'update-user-sidebar',
  imports: [UserForm],
  host: {
    class: 'flex h-full min-h-0 flex-col'
  },
  templateUrl: './update-user-sidebar.html'
})
export class UpdateUserSidebar {
  readonly user = input.required<IUserRow>();
  readonly roles = input.required<IRole[]>();
  readonly isSaving = input(false);
  readonly cancelled = output<void>();
  readonly submitted = output<IUserPayload>();
}
