import { createContext } from 'react';

export interface AuthContextType {
  user: {
    userId: number;
    email: string;
    role: 'ADMIN' | 'PROFESSIONAL';
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);