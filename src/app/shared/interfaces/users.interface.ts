/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */
import type { IEntityFields } from './common.interface';
import type { IRole } from './roles.interface';

export type IUserSocialLinks = Record<string, unknown>;

export interface IUserResponse extends IEntityFields {
  email: string;
  name: string;
  avatar: string | null;
  socialLinks: IUserSocialLinks;
  roles: string[]; // role names, e.g. user, staff, mentor
}

export type IUserRelation = Omit<IUserResponse, 'roles'> & { roles?: IRole[] };

export interface ICreateUserBody {
  email: string;
  name: string;
  password?: string;
  avatar?: string;
  socialLinks?: IUserSocialLinks;
  roles?: string[]; // role UUIDs
}

export interface IUpdateUserBody {
  email?: string;
  name?: string;
  password?: string;
  avatar?: string;
  socialLinks?: IUserSocialLinks;
  roles?: string[]; // role UUIDs
}

export interface IUploadAvatarBody {
  avatar: File; /* append to FormData, not JSON */
}

export interface IImportUsersBody {
  file: File; /* append to FormData, not JSON */
}

export interface IExportUsersQuery {
  q?: string;
}
