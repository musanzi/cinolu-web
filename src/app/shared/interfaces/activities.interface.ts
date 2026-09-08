/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */
import type { IEntityFields, IFormResponses, ISearchQuery } from './common.interface';
import type { IProgram } from './programs.interface';

export interface IActivity extends IEntityFields {
  name: string;
  slug: string;
  description: string | null;
  startDate: string;
  endDate: string;
  participationForm: IFormResponses;
  reviewForm: IFormResponses;
  program?: IProgram;
  type?: IActivityType;
  categories?: IActivityCategory[];
}

export interface IActivityCategory extends IEntityFields {
  name: string;
}

export interface IActivityType extends IEntityFields {
  name: string;
}

export interface ICreateActivityBody {
  programId: string;
  name: string; // max 150
  description?: string;
  typeId: string;
  categoryIds: string[]; // unique category UUIDs
  startDate: string;
  endDate: string; // must be later than startDate
  participationForm: IFormResponses;
  reviewForm: IFormResponses;
}

export type IUpdateActivityBody = Partial<ICreateActivityBody>;

export type IActivitiesQuery = ISearchQuery & {
  programId?: string;
  typeId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
};

export interface ICreateActivityCategoryBody {
  name: string; /* non-empty, max 100 */
}

export type IUpdateActivityCategoryBody = Partial<ICreateActivityCategoryBody>;

export interface ICreateActivityTypeBody {
  name: string; /* non-empty, max 100 */
}

export type IUpdateActivityTypeBody = Partial<ICreateActivityTypeBody>;
