export type User = {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
};
