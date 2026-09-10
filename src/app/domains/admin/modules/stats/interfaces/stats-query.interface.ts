import { ParticipationStatus, VentureStatus } from '@/app/shared/interfaces';
import { INamedCount, IMonthlyCount } from './statistics.interface';

export interface ICountRow {
  total: string;
}

export interface IMonthlyCountRow extends ICountRow {
  month: string;
}

export interface INamedCountRow extends ICountRow {
  name: string;
}

export interface IStatusCountRow<T> extends ICountRow {
  status: T;
}

export interface IMonthlyStatusCountRow<T> extends IStatusCountRow<T> {
  month: string;
}

export interface IActivityLifecycleRow extends ICountRow {
  upcoming: string;
  ongoing: string;
  completed: string;
}

export interface IActivityStatistics {
  total: number;
  lifecycle: {
    upcoming: number;
    ongoing: number;
    completed: number;
  };
  byType: INamedCount[];
}

export interface IUserStatistics {
  total: number;
  registrations: IMonthlyCount[];
  roles: INamedCount[];
}

export interface IProgramStatistics {
  total: number;
  byPortfolio: INamedCount[];
}

export interface IReviewStatistics {
  total: number;
  trend: IMonthlyCount[];
}

export interface IStatusStatistics<T> {
  total: number;
  byStatus: { name: T; total: number }[];
  trend: IMonthlyCount & { status: T }[];
}

export type IParticipationStatistics = IStatusStatistics<ParticipationStatus>;
export type IVentureStatistics = IStatusStatistics<VentureStatus>;
