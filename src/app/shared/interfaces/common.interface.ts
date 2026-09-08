/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */

export interface IPaginationQuery {
  page?: number | string; // integer >= 1; default 1
  limit?: number | string; // integer 1..100; default 20
  take?: number | string; // alias for limit
}

export type IPaginated<T> = [items: T[], total: number];

export interface IEntityFields {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type IFormResponses = Record<string, unknown>;

export interface IApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface IIdParams {
  id: string; /* UUID */
}

export interface IActivityIdParams {
  activityId: string; /* UUID */
}

export interface ISlugParams {
  slug: string;
}

export interface IEmailParams {
  email: string; /* URL-encode when used in a path */
}

export type ISearchQuery = IPaginationQuery & { q?: string };
