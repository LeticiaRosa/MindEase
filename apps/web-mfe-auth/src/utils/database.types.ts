export type User = {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
};

export type AuthError = {
  message: string;
  status?: number;
};
