export type AuthSuccess<T = void> = {
  success: true;
  data?: T;
};

export type AuthFailure = {
  success: false;
  error: {
    message: string;
    status: number;
  };
};

export type AuthResult<T = void> = AuthSuccess<T> | AuthFailure;
