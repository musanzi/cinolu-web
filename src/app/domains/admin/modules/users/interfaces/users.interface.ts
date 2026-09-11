import { IRole, IUser } from '@/app/shared/interfaces';

export interface IQueryParams {
  page: number;
  q: string;
}

export interface IUserPayload {
  email: string;
  name: string;
  roles: string[];
  password?: string;
  jobTitle?: string;
  socialLinks?: Record<string, string>;
}

export interface IUserFormModel {
  email: string;
  name: string;
  roles: string[];
  password: string;
  jobTitle: string;
  socialLinks: IUserSocialLinksFormModel;
}

export interface IUserSocialLinksFormModel {
  facebook: string;
  linkedin: string;
  twitter: string;
}

export type IUserRow = IUser;

export type IUsersResponse = [IUserRow[], number];

export type IUserResponse = IUserRow;

export type IRolesLookupResponse = [IRole[], number];

export interface IUpdateUserCommand {
  id: string;
  payload: IUserPayload;
}

export interface IRemoveUserCommand {
  id: string;
}

export interface IUserDialogData {
  roles: IRole[];
  user?: IUserRow;
}

export interface IUserDialogResult {
  payload: IUserPayload;
}

export interface IRemoveUserDialogData {
  user: IUserRow;
}

export interface IUsersState {
  users: IUserRow[];
  usersCount: number;
  roles: IRole[];
  isLoading: boolean;
  isLoadingRoles: boolean;
  isSaving: boolean;
  isImporting: boolean;
  isExporting: boolean;
  removingUserId: string;
  error: string;
}
