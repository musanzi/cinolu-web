/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */
import type { IEntityFields } from './common.interface';

export interface IRole extends IEntityFields {
  name: string;
}

export interface ICreateRoleBody {
  name: string; /* non-empty; database column max 50 */
}

export type IUpdateRoleBody = Partial<ICreateRoleBody>;
