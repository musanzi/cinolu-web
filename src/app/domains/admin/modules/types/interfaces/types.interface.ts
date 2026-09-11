import { IType } from '@/app/shared/interfaces';

export interface ITypePayload {
  name: string;
}

export interface IUpdateTypePayload {
  name?: string;
}

export type ITypesResponse = [IType[], number];

export interface ITypesQueryParams {
  page: number;
  limit: number;
  q: string;
}

export interface IUpdateTypeCommand {
  id: string;
  payload: IUpdateTypePayload;
}

export interface IRemoveTypeCommand {
  id: string;
}

export interface ITypeDialogData {
  type?: IType;
}

export interface ITypeDialogResult {
  payload: ITypePayload;
}

export interface IRemoveTypeDialogData {
  type: IType;
}

export interface ITypesState {
  isSaving: boolean;
  removingTypeId: string;
  mutationVersion: number;
  error: string;
}
