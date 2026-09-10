import type { IAbstractEntity } from './abstract-entity.interface';
import type { ISector } from './sector.interface';
import type { IUser } from './user.interface';

export enum VentureStage {
  IDEA = 'idea',
  MVP = 'mvp',
  EARLY_STAGE = 'early_stage',
  GROWTH = 'growth',
  MATURE = 'mature'
}

export enum VentureStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface IVenture extends IAbstractEntity {
  name: string;
  slug: string;
  logo?: string;
  cover?: string;
  description: string;
  socials: Record<string, string>;
  owner: IUser;
  stage: VentureStage;
  status: 'pending' | 'approved' | 'rejected';
  sectors: ISector[];
}
