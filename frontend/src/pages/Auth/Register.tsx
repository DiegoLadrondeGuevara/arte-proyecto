// src/pages/Auth/Register.tsx — Versión Artística Cinemática & Surrealista
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { RegisterCredentials } from '../../types/auth';
import type { AxiosError } from 'axios';

const RegisterPage: React.FC = () => {
    const [credentials, setCredentials] = useState<RegisterCredentials>({
        email: '',
        user: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!credentials.email || !credentials.user || !credentials.password) {
            setError("Todos los campos son obligatorios.");
            setIsLoading(false);
            return;
        }

        try {
            await register(credentials);
            navigate('/generate');
        } catch (err) {
            console.error("Error en el registro:", err);
            const errorMessage =
                (err as AxiosError<{ error: string }>)?.response?.data?.error ||
                "Fallo el registro. Intente de nuevo.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>

            {/* Partículas Surrealistas */}
            <div style={styles.particle1}></div>
            <div style={styles.particle2}></div>
            <div style={styles.particle3}></div>

            <div style={styles.card}>
                <h2 style={styles.title}>Crear Identidad Artística 🌟</h2>
                <p style={styles.subtitle}>Tu viaje creativo empieza aquí</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo Electrónico"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />

                    <input
                        type="text"
                        name="user"
                        placeholder="Nombre de Artista"
                        value={credentials.user}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Crea una Contraseña"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />

                    {error && <p style={styles.errorText}>❌ {error}</p>}

                    <button type="submit" disabled={isLoading} style={styles.button}>
                        {isLoading ? "Creando identidad..." : "Forjar Mi Universo Artístico"}
                    </button>
                </form>

                <p style={styles.linkText}>
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" style={styles.link}>
                        Iniciar Sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

// 🎨 Estilos Surrealistas (idénticos al Login)
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #2a0a4a, #0d0221, #000000)",
        position: "relative",
        overflow: "hidden",
    },

    // Partículas luminosas flotantes
    particle1: {
        position: "absolute",
        width: "600px",
        height: "600px",
        background: "rgba(255, 70, 180, 0.25)",
        filter: "blur(120px)",
        borderRadius: "50%",
        top: "-100px",
        left: "-150px",
        animation: "float 9s infinite alternate ease-in-out",
    },
    particle2: {
        position: "absolute",
        width: "500px",
        height: "500px",
        background: "rgba(120, 60, 255, 0.25)",
        filter: "blur(120px)",
        borderRadius: "50%",
        bottom: "-120px",
        right: "-140px",
        animation: "float 11s infinite alternate-reverse ease-in-out",
    },
    particle3: {
        position: "absolute",
        width: "400px",
        height: "400px",
        background: "rgba(40, 200, 255, 0.2)",
        filter: "blur(100px)",
        borderRadius: "50%",
        top: "30%",
        left: "50%",
        animation: "float 13s infinite alternate ease-in-out",
    },

    card: {
        position: "relative",
        padding: "55px",
        width: "420px",
        background: "rgba(255, 255, 255, 0.09)",
        borderRadius: "18px",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: "0 0 40px rgba(255, 200, 255, 0.25)",
        textAlign: "center",
        color: "white",
        zIndex: 3,
        border: "1px solid rgba(255,255,255,0.25)",
    },

    title: {
        fontSize: "2.4em",
        fontWeight: 800,
        marginBottom: "10px",
        background: "linear-gradient(120deg, #ff70e0, #a770ff, #57d0ff)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: "0 0 10px rgba(255, 150, 255, 0.4)",
    },

    subtitle: {
        fontSize: "1.05em",
        color: "#d8cfff",
        letterSpacing: "0.8px",
        marginBottom: "30px",
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "22px",
    },

    input: {
        padding: "15px",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.35)",
        background: "rgba(0,0,0,0.25)",
        color: "white",
        fontSize: "16px",
        outline: "none",
        transition: "0.25s",
    },

    button: {
        padding: "14px",
        borderRadius: "10px",
        fontWeight: 700,
        border: "none",
        fontSize: "17px",
        background: "linear-gradient(135deg, #ff5de6, #9f79ff, #57d9ff)",
        color: "white",
        cursor: "pointer",
        boxShadow: "0 0 20px rgba(165, 120, 255, 0.6)",
        transition: "0.2s",
    },

    errorText: {
        color: "#ff8383",
        fontSize: "14px",
        padding: "8px",
        background: "rgba(255, 100, 100, 0.1)",
        borderRadius: "6px",
        border: "1px solid #ff6b6b",
    },

    linkText: {
        marginTop: "30px",
        color: "#d8cfff",
        fontSize: "14px",
    },

    link: {
        color: "#a579ff",
        fontWeight: 600,
    },
};

export default RegisterPage;
