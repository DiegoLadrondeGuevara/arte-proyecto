// src/hooks/useAuth.ts (Archivo Nuevo)

import { useContext } from 'react';
// Importamos AuthContext del archivo separado
import { AuthContext } from '../context/AuthContext'; 

// Hook Personalizado
export const useAuth = () => {
    const context = useContext(AuthContext); 
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context; 
};