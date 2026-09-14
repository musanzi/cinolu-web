import type { ISector, IVenture, VentureStage } from '@/app/shared/interfaces';

export interface IVenturePayload {
  name: string;
  description: string;
  socials?: Record<string, string>;
  stage: VentureStage;
  sectorIds: string[];
}

export interface IVentureFormModel {
  name: string;
  description: string;
  stage: VentureStage;
  sectorIds: string[];
  website: string;
  linkedin: string;
  facebook: string;
  instagram: string;
}

export interface IVentureFormResult {
  payload: IVenturePayload;
  logo?: File;
  cover?: File;
}

export interface ISaveVentureCommand extends IVentureFormResult {
  onSuccess: (venture: IVenture) => void;
}

export interface IUpdateVentureCommand extends ISaveVentureCommand {
  id: string;
}

export interface IRemoveVentureCommand {
  id: string;
  onSuccess: () => void;
}

export interface IRemoveVentureDialogData {
  venture: IVenture;
}

export interface IVenturesState {
  isSaving: boolean;
  removingVentureId: string;
  error: string;
  success: string;
}

export interface IVenturesQuery {
  page: number;
  limit: number;
  q: string;
  sectorId: string;
  stage: VentureStage | '';
  status: IVenture['status'] | '';
}

export interface IVentureFilterOption<T> {
  value: T;
  label: string;
}

export type IVentureFilterKey = 'q' | 'sectorId' | 'stage' | 'status';
export type IVenturesResponse = [IVenture[], number];
export type ISectorsResponse = [ISector[], number];
