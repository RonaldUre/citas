import { api } from '@/lib/axios';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  userId: number;
  email: string;
  role: 'ADMIN' | 'PROFESSIONAL';
}

export const login = (data: LoginPayload) =>
  api.post<{ access_token: string }>('/auth/login', data);

export const getMe = () => api.get<User>('/auth/me');