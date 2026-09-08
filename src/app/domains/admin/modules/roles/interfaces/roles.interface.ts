import { IRole } from '@/app/shared/interfaces';

export interface IRolePayload {
  name: string;
}

export type IRolesResponse = [IRole[], number];

export type IRoleResponse = IRole;

export interface IUpdateRoleCommand {
  id: string;
  payload: IRolePayload;
}

export interface IRemoveRoleCommand {
  id: string;
}

export interface IRoleDialogData {
  role?: IRole;
}

export interface IRoleDialogResult {
  payload: IRolePayload;
}

export interface IRemoveRoleDialogData {
  role: IRole;
}

export interface IRolesState {
  roles: IRole[];
  isLoading: boolean;
  isSaving: boolean;
  removingRoleId: string;
  error: string;
}
