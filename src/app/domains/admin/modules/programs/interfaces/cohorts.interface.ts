import type { ICohort } from '@/app/shared/interfaces';

export interface ICreateCohortPayload {
  name: string;
  programId: string;
}

export interface IUpdateCohortPayload {
  name: string;
}

export interface IUpdateCohortCommand {
  id: string;
  payload: IUpdateCohortPayload;
}

export interface IRemoveCohortCommand {
  id: string;
}

export interface ICohortDialogData {
  programId: string;
  cohort?: ICohort;
}

export interface ICohortDialogResult {
  name: string;
}

export interface IRemoveCohortDialogData {
  cohort: ICohort;
}

export interface ICohortsQuery {
  programId: string;
  page: number;
  limit: number;
}

export type ICohortsResponse = [ICohort[], number];

export interface ICohortsState {
  isSaving: boolean;
  removingCohortId: string;
  mutationVersion: number;
  error: string;
}
