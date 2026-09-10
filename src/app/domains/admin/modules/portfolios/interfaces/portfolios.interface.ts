import { IPortfolio } from '@/app/shared/interfaces';

export interface IPortfolioQueryParams {
  page: number;
  q: string;
}

export interface IPortfolioPayload {
  name: string;
  description: string;
}

export type IPortfoliosResponse = [IPortfolio[], number];

export interface ISavePortfolioCommand {
  payload: IPortfolioPayload;
  logo?: File;
  onSuccess: () => void;
}

export interface IUpdatePortfolioCommand extends ISavePortfolioCommand {
  id: string;
}

export interface IRemovePortfolioCommand {
  id: string;
  onSuccess: () => void;
}

export interface IPortfolioDialogData {
  portfolio?: IPortfolio;
}

export interface IPortfolioDialogResult {
  payload: IPortfolioPayload;
  logo?: File;
}

export interface IRemovePortfolioDialogData {
  portfolio: IPortfolio;
}

export interface IPortfoliosMutationState {
  isSaving: boolean;
  removingPortfolioId: string;
  error: string;
}
