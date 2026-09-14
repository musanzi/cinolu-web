import type { IParticipation, ParticipationStatus } from '@/app/shared/interfaces';

export interface ICreateParticipationPayload {
  activityId: string;
  data: string;
}

export interface IUpdateParticipationPayload {
  data: string;
}

export interface ICreateParticipationCommand {
  activityId: string;
  responses: Record<string, string | string[]>;
}

export interface IUpdateParticipationCommand {
  id: string;
  responses: Record<string, string | string[]>;
}

export interface IParticipationsQuery {
  page: number;
  limit: number;
  status: ParticipationStatus | '';
}

export type IParticipationsResponse = [IParticipation[], number];

export interface IParticipationsState {
  isSaving: boolean;
  mutationVersion: number;
  createdParticipationId: string;
  updateSucceeded: boolean;
  error: string;
}
