/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */

export interface ISignUpBody {
  name: string;
  email: string;
  password: string; // at least 6 characters
}

export interface ISignInBody {
  email: string;
  password: string;
}

export interface IForgotPasswordBody {
  email: string;
}

export interface IResetPasswordBody {
  token: string;
  password: string; /* minimum 6 characters */
}

export interface IUpdatePasswordBody {
  password: string; /* minimum 6 characters */
}
