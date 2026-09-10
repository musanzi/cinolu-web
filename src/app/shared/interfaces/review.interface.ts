import type { IAbstractEntity } from './abstract-entity.interface';
import type { IActivity } from './activity.interface';
import type { IUser } from './user.interface';

export interface IReview extends IAbstractEntity {
  reviewer: IUser;
  activity: IActivity;
  data: Record<string, unknown>;
}
