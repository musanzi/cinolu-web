import { IPortfolio, IProgram, IUser } from '@/app/shared/interfaces';

export interface IProgramsQuery {
  page: number;
  q: string;
  portfolioId: string;
}

export interface IProgramPayload {
  name: string;
  description?: string;
  portfolioId: string;
  managers?: string[];
}

export interface IProgramFormModel {
  name: string;
  description: string;
  portfolioId: string;
  managers: string[];
}

export type IProgramsResponse = [IProgram[], number];
export type IPortfoliosLookupResponse = [IPortfolio[], number];
export type IStaffLookupResponse = IUser[];

export interface ICreateProgramCommand {
  payload: IProgramPayload;
  logo?: File;
}

export interface IUpdateProgramCommand extends ICreateProgramCommand {
  id: string;
}

export interface IRemoveProgramCommand {
  id: string;
}

export interface IProgramDialogData {
  portfolios: IPortfolio[];
  staff: IUser[];
  program?: IProgram;
}

export type IProgramDialogResult = ICreateProgramCommand;

export interface IRemoveProgramDialogData {
  program: IProgram;
}

export interface IProgramsState {
  isSaving: boolean;
  removingProgramId: string;
  mutationVersion: number;
  error: string;
}
