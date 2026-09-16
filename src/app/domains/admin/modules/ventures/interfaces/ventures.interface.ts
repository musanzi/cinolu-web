import { ISector, IVenture, VentureStage, VentureStatus } from '@/app/shared/interfaces';

export interface IVenturesQuery {
  page: number;
  limit: number;
  q: string;
  sectorId: string;
  stage: VentureStage | '';
  status: VentureStatus | '';
}

export interface IVentureFilterOption<T> {
  value: T;
  label: string;
}

export type IVentureFilterKey = 'q' | 'sectorId' | 'stage' | 'status';

export interface IVentureStatusPayload {
  status: VentureStatus;
}

export interface IChangeVentureStatusCommand {
  id: string;
  payload: IVentureStatusPayload;
}

export interface IVenturesState {
  ventureId: string;
  error: string;
}

export type IVenturesResponse = [IVenture[], number];
export type ISectorsLookupResponse = [ISector[], number];
