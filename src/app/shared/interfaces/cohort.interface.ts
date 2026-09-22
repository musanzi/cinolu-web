import type { IAbstractEntity } from './abstract-entity.interface';
import type { IProgram } from './program.interface';

export interface ICohort extends IAbstractEntity {
  name: string;
  program: IProgram;
}
