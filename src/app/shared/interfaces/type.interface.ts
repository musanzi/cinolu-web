import type { IAbstractEntity } from './abstract-entity.interface';
import type { IActivity } from './activity.interface';

export interface IType extends IAbstractEntity {
  name: string;
  activities: IActivity[];
}
