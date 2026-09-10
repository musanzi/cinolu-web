import { IAbstractEntity } from '@/app/shared/interfaces';

export interface INamedEntity extends IAbstractEntity {
  name: string;
}

export interface IReferenceDataConfig {
  endpoint: string;
  singular: string;
  plural: string;
  description: string;
}

export interface INamedEntityPayload {
  name: string;
}

export type IReferenceDataResponse = [INamedEntity[], number];

export interface ICreateNamedEntityCommand {
  endpoint: string;
  payload: INamedEntityPayload;
}

export interface IUpdateNamedEntityCommand extends ICreateNamedEntityCommand {
  id: string;
}

export interface IRemoveNamedEntityCommand {
  endpoint: string;
  id: string;
}

export interface INamedEntityDialogData {
  singular: string;
  entity?: INamedEntity;
}

export interface INamedEntityDialogResult {
  payload: INamedEntityPayload;
}

export interface IRemoveNamedEntityDialogData {
  singular: string;
  entity: INamedEntity;
}

export interface IReferenceDataState {
  isSaving: boolean;
  removingEntityId: string;
  mutationVersion: number;
  error: string;
}
