/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */
import type { IActivity } from './activities.interface';
import type { IPaginationQuery, IEntityFields, IFormResponses, ISearchQuery } from './common.interface';
import type { IUserRelation } from './users.interface';

export type IParticipationStatus = 'pending' | 'approved' | 'cancelled';

export interface IActivityParticipation extends IEntityFields {
  userId: string;
  responses: IFormResponses;
  status: IParticipationStatus;
  submitDate: string;
  activity?: IActivity;
  user?: IUserRelation;
}

export interface ISaveFormResponseBody {
  responses: IFormResponses;
}

export interface IUpdateParticipationStatusBody {
  status: IParticipationStatus;
}

export type IMyParticipationsQuery = IPaginationQuery & { status?: IParticipationStatus };

export type IActivityParticipationsQuery = ISearchQuery & { status?: IParticipationStatus };

export interface IExportParticipationsQuery {
  status?: IParticipationStatus;
  q?: string;
}
