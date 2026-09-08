import { ISignInPayload } from './signin-payload.interface';

export interface ISignUpPayload extends ISignInPayload {
  name: string;
}
