export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  fullName?: string;
}

export interface MagicLinkInput {
  email: string;
  redirectTo?: string;
}
