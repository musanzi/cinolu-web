import type { IAbstractEntity } from './abstract-entity.interface';

export interface IPortfolio extends IAbstractEntity {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
}
