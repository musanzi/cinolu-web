import { IRole, IUser } from '@/app/shared/interfaces';

export interface IProfileSocialLinksFormModel {
  facebook: string;
  linkedin: string;
  twitter: string;
}

export interface IProfileFormModel {
  name: string;
  email: string;
  jobTitle: string;
  socialLinks: IProfileSocialLinksFormModel;
  roles: string[];
}

export interface IUpdatePasswordFormModel {
  password: string;
  confirmPassword: string;
}

export interface IUpdatePasswordPayload {
  password: string;
}

export interface IUpdateProfilePayload {
  email?: string;
  name?: string;
  password?: string;
  avatar?: string;
  jobTitle?: string;
  socialLinks?: Record<string, string>;
  roles?: string[];
}

export type IProfileResponse = IUser;

export type IProfileImageResponse = IUser;

export type IProfileRolesResponse = [IRole[], number];

export interface IProfileState {
  isUpdatingProfile: boolean;
  isUpdatingProfileImage: boolean;
  isUpdatingPassword: boolean;
  profileUpdated: boolean;
  profileImageUpdated: boolean;
  passwordUpdated: boolean;
  profileError: string;
  profileImageError: string;
  passwordError: string;
}
