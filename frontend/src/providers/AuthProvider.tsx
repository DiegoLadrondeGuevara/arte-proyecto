// src/providers/AuthProvider.tsx (Tu antiguo AuthContext.tsx, renombrado)

import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../context/AuthContext'; 

// Importamos tipos y APIs
import type { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';
import { registerUser, loginUser, logoutUser } from '../api/auth';
import axios from 'axios';

// --- Componente Proveedor (Provider) ---

interface AuthProviderProps {
    children: ReactNode;
}

// Función de Inicialización (Sincrónico)
const getInitialAuthState = (): { user: User | null; token: string | null } => {
    const storedToken = localStorage.getItem('authToken');
    let storedUser: User | null = null;
    
    try {
        const userJson = localStorage.getItem('authUser');
        if (userJson) {
            storedUser = JSON.parse(userJson) as User;
        }
    } catch (e) {
        console.error("Error al parsear el usuario desde localStorage:", e);
        localStorage.removeItem('authToken');
        return { user: null, token: null };
    }

    return {
        user: storedUser,
        token: storedToken,
    };
};


// Este archivo solo exporta el componente.
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    
    const initialState = getInitialAuthState();
    
    const [user, setUser] = useState<User | null>(initialState.user);
    const [token, setToken] = useState<string | null>(initialState.token);
    // Inicializado en FALSE, ya que la carga inicial es síncrona
    const [isLoading, setIsLoading] = useState<boolean>(false); 
    
    const isLoggedIn = !!token;

    // 1. Efecto para configurar Axios
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // 2. Función de Login
    const handleLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
        setIsLoading(true); // 🟢 INICIO DE CARGA
        try {
            const authData = await loginUser(credentials);
            setToken(authData.token);
            setUser(authData.user);
            localStorage.setItem('authToken', authData.token);
            localStorage.setItem('authUser', JSON.stringify(authData.user));
            return authData;
        } finally {
            setIsLoading(false); // 🟢 FIN DE CARGA (éxito o error)
        }
    };

    // 3. Función de Registro
    const handleRegister = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        setIsLoading(true); // 🟢 INICIO DE CARGA
        try {
            const authData = await registerUser(credentials);
            setToken(authData.token);
            setUser(authData.user);
            localStorage.setItem('authToken', authData.token);
            localStorage.setItem('authUser', JSON.stringify(authData.user));
            return authData;
        } finally {
            setIsLoading(false); // 🟢 FIN DE CARGA (éxito o error)
        }
    };

    // 4. Función de Logout
    const handleLogout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        delete axios.defaults.headers.common['Authorization'];
        logoutUser();
    };

    const contextValue: AuthContextType = {
        user,
        token,
        isLoggedIn,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isLoading
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {/* El spinner se muestra durante el login/register si isLoading es true */}
            {isLoading ? <div>Cargando sesión...</div> : children}
        </AuthContext.Provider>
    );
};