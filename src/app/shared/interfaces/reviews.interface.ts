/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */
import type { IActivity } from './activities.interface';
import type { IEntityFields, IFormResponses } from './common.interface';
import type { IUserRelation } from './users.interface';

export interface IActivityReview extends IEntityFields {
  responses: IFormResponses;
  submitDate: string;
  activity?: IActivity;
  user?: IUserRelation;
}

export interface IReviewStatistics {
  totalReviews: number;
  firstSubmitDate: string | null;
  lastSubmitDate: string | null;
  questions: {
    question: string;
    answered: number;
    answers: { value: string; count: number }[];
  }[];
}
