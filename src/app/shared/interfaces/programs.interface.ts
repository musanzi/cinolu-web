/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */
import type { IActivity } from './activities.interface';
import type { IEntityFields, ISearchQuery } from './common.interface';
import type { IPortfolio } from './portfolios.interface';
import type { IUserRelation } from './users.interface';

export interface IProgram extends IEntityFields {
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  portfolio?: IPortfolio;
  programManagers?: IUserRelation[];
  activities?: IActivity[];
}

export interface ICreateProgramBody {
  portfolioId: string;
  name: string; // max 150
  description?: string;
  logo?: string; // max 255
  programManagerIds?: string[]; // unique user UUIDs
}

export type IUpdateProgramBody = Partial<ICreateProgramBody>;

export type IProgramsQuery = ISearchQuery & { portfolioId?: string; managerId?: string };
