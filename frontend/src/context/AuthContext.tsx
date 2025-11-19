// src/context/AuthContext.ts

import { createContext } from 'react';
// Asegúrate de que esta ruta a tus tipos de auth sea correcta
import type { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';

// 1. Interfaz del Contexto
export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
    logout: () => void;
    isLoading: boolean;
}

// 2. Creación del Contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);