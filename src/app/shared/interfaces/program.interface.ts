import type { IAbstractEntity } from './abstract-entity.interface';
import type { IActivity } from './activity.interface';
import type { IPortfolio } from './portfolio.interface';
import type { IUser } from './user.interface';

export interface IProgram extends IAbstractEntity {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  portfolio: IPortfolio;
  managers: IUser[];
  activities: IActivity[];
}
