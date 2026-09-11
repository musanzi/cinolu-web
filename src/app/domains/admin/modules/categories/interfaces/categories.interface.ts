import { ICategory } from '@/app/shared/interfaces';

export interface ICategoryPayload {
  name: string;
}

export type ICategoriesResponse = [ICategory[], number];

export interface ICategoriesQueryParams {
  page: number;
  limit: number;
  q: string;
}

export interface IUpdateCategoryCommand {
  id: string;
  payload: ICategoryPayload;
}

export interface IRemoveCategoryCommand {
  id: string;
}

export interface ICategoryDialogData {
  category?: ICategory;
}

export interface ICategoryDialogResult {
  payload: ICategoryPayload;
}

export interface IRemoveCategoryDialogData {
  category: ICategory;
}

export interface ICategoriesState {
  isSaving: boolean;
  removingCategoryId: string;
  mutationVersion: number;
  error: string;
}
