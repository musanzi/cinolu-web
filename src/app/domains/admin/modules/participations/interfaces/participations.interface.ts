import { IActivity, IParticipation, ParticipationStatus } from '@/app/shared/interfaces';

export interface IParticipationsQuery {
  page: number;
  limit: number;
  q: string;
  status: ParticipationStatus | '';
  activityId: string;
}

export type IActivitiesLookupResponse = IActivity[];

export type IParticipationRow = IParticipation;

export type IParticipationsResponse = [IParticipationRow[], number];

export type IParticipationResponse = IParticipationRow;

export interface IParticipationStatusPayload {
  status: ParticipationStatus;
}

export interface IUpdateParticipationStatusCommand {
  id: string;
  status: ParticipationStatus;
}

export interface IRemoveParticipationCommand {
  id: string;
}

export interface IRemoveParticipationDialogData {
  participation: IParticipationRow;
}

export interface IParticipationsState {
  isSaving: boolean;
  mutationVersion: number;
  updateSucceeded: boolean;
  removingParticipationId: string;
  error: string;
}
