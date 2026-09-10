import type { IAbstractEntity } from './abstract-entity.interface';
import type { IParticipation } from './participation.interface';
import type { IReview } from './review.interface';
import type { IVenture } from './venture.interface';

export interface IUser extends IAbstractEntity {
  name: string;
  email: string;
  avatar: string;
  jobTitle?: string;
  password: string;
  biography: string;
  socialLinks: Record<string, string>;
  roles: string[];
  ventures: IVenture[];
  participations: IParticipation[];
  reviews: IReview[];
}
