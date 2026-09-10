import type { IUser } from '@/app/shared/interfaces';

export interface IAuthState {
  user: IUser | null;
}
