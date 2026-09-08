/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */
import type { IEntityFields } from './common.interface';
import type { IProgram } from './programs.interface';

export interface IPortfolio extends IEntityFields {
  name: string;
  slug: string;
  description: string | null;
  logo?: string | null;
  programs?: IProgram[];
}

export interface ICreatePortfolioBody {
  name: string; // max 150
  description?: string;
  logo?: string; // max 255
}

export type IUpdatePortfolioBody = Partial<ICreatePortfolioBody>;
