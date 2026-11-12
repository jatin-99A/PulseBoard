import apiClient from './axios-client';
import type {
  SignupInput,
  SigninInput,
  ApiResponse,
  SigninResponseData,
  SignupResponseData,
  User,
} from '../types/auth';

export const authApi = {
  signup: async (data: SignupInput): Promise<ApiResponse<SignupResponseData>> => {
    const res = await apiClient.post<ApiResponse<SignupResponseData>>('/auth/signup', data);
    return res.data;
  },

  signin: async (data: SigninInput): Promise<ApiResponse<SigninResponseData>> => {
    const res = await apiClient.post<ApiResponse<SigninResponseData>>('/auth/signin', data);
    return res.data;
  },

  signout: async (): Promise<ApiResponse<void>> => {
    const res = await apiClient.post<ApiResponse<void>>('/auth/signout');
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const res = await apiClient.post<ApiResponse<User>>('/auth/me');
    return res.data;
  },
};

