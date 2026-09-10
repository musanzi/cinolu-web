import { IActivity, IReview } from '@/app/shared/interfaces';

export interface IReviewsQuery {
  page: number;
  limit: number;
  activityId: string;
}

export type IReviewsResponse = [IReview[], number];
export type IActivitiesLookupResponse = [IActivity[], number];
