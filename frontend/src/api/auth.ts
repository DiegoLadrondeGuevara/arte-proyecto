// src/api/auth.ts
import axios from 'axios';
import type { RegisterCredentials, LoginCredentials, AuthResponse } from '../types/auth';

// ⚠️ IMPORTANTE: Reemplaza esta URL con la URL base de tu API Gateway
// Ejemplo: https://y25ok2g1o9.execute-api.us-east-1.amazonaws.com/dev
const API_BASE_URL = "https://2i4in2nwq6.execute-api.us-east-1.amazonaws.com/dev";
/**
 * Función para registrar un nuevo usuario.
 * @param credentials - Datos de registro (email, user, password).
 */
export async function registerUser(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/auth/register`,
        credentials
    );
    return response.data;
}

/**
 * Función para iniciar sesión.
 * @param credentials - Datos de inicio de sesión (email, password).
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/auth/login`,
        credentials
    );
    return response.data;
}

/**
 * Función para simular el logout (simplemente limpia el estado local).
 */
export function logoutUser(): void {
    // La lógica de limpieza se manejará en el AuthContext
    console.log("Sesión cerrada localmente.");
}