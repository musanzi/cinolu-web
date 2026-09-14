import type { IActivity, IProgram } from '@/app/shared/interfaces';

export interface IActivitiesQuery {
  q: string;
  page: string;
  startDate: string;
  endDate: string;
  limit: string;
  take: string;
  programId: string;
}

export type IActivitiesResponse = [IActivity[], number];
export type IProgramsResponse = [IProgram[], number];
