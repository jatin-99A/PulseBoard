export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified?: boolean;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SigninInput {
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface SigninResponseData {
  user: User;
}

export interface SignupResponseData {
  id: string;
  email: string;
}

