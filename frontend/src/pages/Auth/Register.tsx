// src/pages/Auth/Register.tsx (Rediseño Artístico)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { RegisterCredentials } from '../../types/auth';
import type { AxiosError } from 'axios';

const RegisterPage: React.FC = () => {
    // 1. Estados del formulario y de la UI
    const [credentials, setCredentials] = useState<RegisterCredentials>({
        email: '',
        user: '', // Corresponde al campo 'username'
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // 2. Hooks para navegación y autenticación
    const { register } = useAuth();
    const navigate = useNavigate();

    // 3. Manejador de cambios en los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
            // Nota: Si el campo se llama 'user' en el estado, pero la API espera 'username',
            // asegúrate de que el hook 'register' maneje esa conversión internamente.
        });
        setError(null); 
    };

    // 4. Manejador de envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validación simple
        if (!credentials.email || !credentials.user || !credentials.password) {
            setError('Todos los campos son obligatorios.');
            setIsLoading(false);
            return;
        }

        try {
            await register(credentials);
            
            // Éxito: Navegar al Dashboard después del registro (y login automático)
            navigate('/'); 
        } catch (err: unknown) {
            console.error("Error en el registro:", err);
            // Mostrar un mensaje de error más específico si está disponible
            const errorMessage = (err as AxiosError<{ error: string }>)?.response?.data?.error || 'Fallo el registro. Intente de nuevo.';
            setError(errorMessage);
        }finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Crea tu Galería Digital 🚀</h2>
                <p style={styles.subtitle}>Únete a la comunidad de artistas IA.</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    
                    {/* Campo de Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo Electrónico"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    
                    {/* Campo de Username */}
                    <input
                        type="text"
                        name="user" 
                        placeholder="Nombre de Artista (Usuario)"
                        value={credentials.user}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    
                    {/* Campo de Contraseña */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña Secreta"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />

                    {/* Mensaje de Error */}
                    {error && <p style={styles.errorText}>❌ {error}</p>}

                    {/* Botón de Envío */}
                    <button type="submit" disabled={isLoading} style={styles.button}>
                        {isLoading ? 'Creando...' : 'Crear Perfil Artístico'}
                    </button>
                </form>

                <p style={styles.linkText}>
                    ¿Ya tienes cuenta? <Link to="/login" style={styles.link}>Inicia Viaje Creativo</Link>
                </p>
            </div>
        </div>
    );
};

// Estilos Extravagantes y Artísticos (Consistentes con Login.tsx)
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 80px)', 
        paddingTop: '40px',
        paddingBottom: '40px',
        // Fondo con un gradiente sutil y oscuro para evocar el espacio digital
        background: 'linear-gradient(135deg, #1f1c2c 0%, #000000 100%)',
    },
    card: {
        padding: '50px',
        // Efecto "Frosted Glass" (Vidrio Esmerilado)
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        backdropFilter: 'blur(10px)', // Suaviza lo que está detrás
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '15px',
        // Sombra de color neón/digital
        boxShadow: '0 8px 32px 0 rgba(100, 100, 255, 0.3)',
        textAlign: 'center',
        width: '400px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        color: 'white',
        animation: 'fadeIn 1s ease-out', // Animación de entrada
    },
    title: {
        fontSize: '2.2em',
        fontWeight: 700,
        marginBottom: '5px',
        // Degradado de texto
        background: 'linear-gradient(90deg, #a770ff, #e75a7c, #ff9b71)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 5px rgba(255, 100, 255, 0.5)',
    },
    subtitle: {
        fontSize: '1em',
        color: '#b0b0d0',
        marginBottom: '30px',
        letterSpacing: '0.5px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: '25px',
    },
    input: {
        padding: '14px',
        borderRadius: '8px',
        border: '1px solid #4a4a6b', // Borde más oscuro
        fontSize: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Fondo casi transparente
        color: 'white',
        transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    button: {
        padding: '14px',
        borderRadius: '8px',
        border: 'none',
        // Gradiente vibrante para el botón
        background: 'linear-gradient(45deg, #6c5ce7 0%, #a770ff 100%)',
        color: 'white',
        fontSize: '17px',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(108, 92, 231, 0.5)',
        transition: 'opacity 0.3s, transform 0.1s',
    },
    errorText: {
        color: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        padding: '8px',
        borderRadius: '5px',
        margin: '10px 0',
        fontSize: '14px',
        border: '1px solid #ff6b6b',
    },
    linkText: {
        marginTop: '30px',
        fontSize: '14px',
        color: '#b0b0d0',
    },
    link: {
        color: '#8e79f6',
        textDecoration: 'underline',
        fontWeight: 600,
    }
};

export default RegisterPage;