// src/components/common/ProtectedRoute.tsx
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.ts';

interface ProtectedRouteProps {
    children: ReactNode;
}

/**
 * Componente que envuelve las rutas que requieren autenticación.
 * Si el usuario no está logeado, lo redirige a la página de login.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isLoggedIn, isLoading } = useAuth();

    // 1. Mostrar un estado de carga mientras se verifica el token inicial
    if (isLoading) {
        return <div>Cargando...</div>; 
    }

    // 2. Si NO está logeado, redirigir al login
    if (!isLoggedIn) {
        // Redirige al usuario al '/login'
        // 'replace: true' asegura que la página de login reemplace la ruta actual en el historial
        return <Navigate to="/login" replace />;
    }

    // 3. Si SÍ está logeado, renderizar el contenido de la ruta
    return <>{children}</>;
};

export default ProtectedRoute;