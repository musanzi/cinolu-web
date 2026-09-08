/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */
import type { IEntityFields, ISearchQuery } from './common.interface';
import type { IUserRelation } from './users.interface';

export interface IVenture extends IEntityFields {
  name: string;
  slug: string;
  pitch: string;
  description: string;
  logo?: string | null;
  links: Record<string, unknown>;
  status: IVentureStatus;
  owner?: IUserRelation;
  categories?: IVentureCategory[];
}

export interface IVentureCategory extends IEntityFields {
  name: string;
}

export type IVentureStatus = 'draft' | 'published' | 'rejected';

export interface ICreateVentureBody {
  categoryIds?: string[]; // unique venture category UUID v4s; must exist
  name: string; // max 150
  pitch: string; // max 255
  description: string;
  logo?: string; // max 255
  links?: Record<string, unknown>;
}

export type IUpdateVentureBody = Partial<ICreateVentureBody>;

export interface ICreateVentureCategoryBody {
  name: string; /* non-empty, max 100 */
}

export type IUpdateVentureCategoryBody = Partial<ICreateVentureCategoryBody>;

export interface IUpdateVentureStatusBody {
  status: IVentureStatus;
}

export type IPublishedVenturesQuery = ISearchQuery & { categoryId?: string };

export type IVenturesQuery = IPublishedVenturesQuery & { status?: IVentureStatus };
