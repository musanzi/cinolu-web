import type { IActivity, ICategory, IForm, IProgram, IType, IUser } from '@/app/shared/interfaces';

export interface IActivityResource {
  title: string;
  value: string;
}

export interface IActivityPayload {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  participationForm: IForm[];
  isPublished?: boolean;
  reviewForm: IForm[];
  resources: IActivityResource[];
  programId: string;
  mentorIds: string[];
  typeIds: string[];
  categoryIds: string[];
}

export interface IActivityDetailsFormModel {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  programId: string;
  mentorIds: string[];
  typeIds: string[];
  categoryIds: string[];
}

export interface IActivityLookups {
  programs: IProgram[];
  mentors: IUser[];
  types: IType[];
  categories: ICategory[];
}

export type IProgramsLookupResponse = [IProgram[], number];
export type ITypesLookupResponse = [IType[], number];
export type ICategoriesLookupResponse = [ICategory[], number];
export type IMentorsLookupResponse = IUser[];

export interface IActivityFormResult {
  payload: IActivityPayload;
  cover?: File;
}

export type ICreateActivityCommand = IActivityFormResult;

export interface IUpdateActivityCommand extends IActivityFormResult {
  id: string;
}

export interface IActivityIdCommand {
  id: string;
}

export interface IRemoveActivityDialogData {
  activity: IActivity;
}

export interface IActivitiesState {
  isSaving: boolean;
  removingActivityId: string;
  togglingActivityId: string;
  error: string;
  success: string;
}

export interface IActivitiesQuery {
  page: number;
  limit: number;
  q?: string;
  startDate?: string;
  endDate?: string;
}
export type IActivitiesResponse = [IActivity[], number];
