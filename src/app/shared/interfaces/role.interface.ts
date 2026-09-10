import type { IAbstractEntity } from './abstract-entity.interface';
import type { IUser } from './user.interface';

export interface IRole extends IAbstractEntity {
  name: string;
  users: IUser[];
}
