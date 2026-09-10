import type { IAbstractEntity } from './abstract-entity.interface';
import type { IActivity } from './activity.interface';
import type { IUser } from './user.interface';

export enum ParticipationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined'
}

export type ParticipationData = Record<string, string>;

export interface IParticipation extends IAbstractEntity {
  participant: IUser;
  activity: IActivity;
  data: Record<string, string>;
  status: Record<string, string>;
}
