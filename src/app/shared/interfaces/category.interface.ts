import type { IAbstractEntity } from './abstract-entity.interface';
import type { IActivity } from './activity.interface';

export interface ICategory extends IAbstractEntity {
  name: string;
  activities: IActivity[];
}
