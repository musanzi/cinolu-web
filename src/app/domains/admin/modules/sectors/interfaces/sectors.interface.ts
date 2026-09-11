import { ISector } from '@/app/shared/interfaces';

export interface ISectorPayload {
  name: string;
}
export type ISectorsResponse = [ISector[], number];
export interface ISectorsQueryParams {
  page: number;
  limit: number;
  q?: string;
}
export interface IUpdateSectorCommand {
  id: string;
  payload: ISectorPayload;
}
export interface IRemoveSectorCommand {
  id: string;
}
export interface ISectorDialogData {
  sector?: ISector;
}
export interface ISectorDialogResult {
  payload: ISectorPayload;
}
export interface IRemoveSectorDialogData {
  sector: ISector;
}
export interface ISectorsState {
  isSaving: boolean;
  removingSectorId: string;
  mutationVersion: number;
  error: string;
}
