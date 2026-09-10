import type { IAbstractEntity } from './abstract-entity.interface';
import type { ICategory } from './category.interface';
import type { IParticipation } from './participation.interface';
import type { IProgram } from './program.interface';
import type { IReview } from './review.interface';
import type { IType } from './type.interface';
import type { IUser } from './user.interface';

export interface IActivity extends IAbstractEntity {
  name: string;
  slug: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  participationForm: Record<string, string>;
  isPublished: boolean;
  reviewForm: Record<string, string>;
  cover?: string;
  program: IProgram;
  mentors: IUser[];
  types: IType[];
  categories: ICategory[];
  participations: IParticipation[];
  reviews: IReview[];
}
