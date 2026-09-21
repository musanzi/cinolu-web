import type { IActivity, IPortfolio, IProgram } from '@/app/shared/interfaces';

export interface IProgramsQuery {
  q: string;
  portfolioId: string;
  page: string;
  limit: string;
  take: string;
}

export type IProgramsResponse = [IProgram[], number];
export type IPortfoliosResponse = [IPortfolio[], number];
export type IProgramActivitiesResponse = [IActivity[], number];
