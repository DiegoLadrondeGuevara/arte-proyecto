// src/components/ui/NavBar.tsx — Versión Cinemática & Surrealista
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Ícono artístico luminoso
const PaintBrushIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M18.36 6.64l-1.42 1.42M14 4h-4L6 8v4l4 4h4l4-4V8l-4-4z" />
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="18" y1="8" x2="20" y2="8" />
        <line x1="18" y1="14" x2="20" y2="14" />
        <line x1="12" y1="16" x2="12" y2="18" />
        <line x1="6" y1="14" x2="4" y2="14" />
        <line x1="6" y1="8" x2="4" y2="8" />
    </svg>
);

const NavBar: React.FC = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { path: '/', label: 'Dashboard', requiresAuth: true },
        { path: '/generate', label: 'Generar Arte', requiresAuth: true },
    ];

    const username = user?.username || user?.email || "Artista";

    return (
        <nav style={styles.nav}>

            {/* Halo luminoso */}
            <div style={styles.glowBar}></div>

            {/* Logo */}
            <div style={styles.logoContainer}>
                <PaintBrushIcon style={styles.logoIcon} />
                <Link to={user ? "/" : "/login"} style={styles.logoText}>
                    EchoArt
                </Link>
            </div>

            {/* Enlaces */}
            <div style={styles.linksContainer}>
                {user ? (
                    <>
                        {navLinks.map((link) => (
                            <Link key={link.path} to={link.path} style={styles.navLink}>
                                {link.label}
                            </Link>
                        ))}

                        <span style={styles.userInfo}>
                            🌙 <span style={styles.username}>{username}</span>
                        </span>

                        <button onClick={handleLogout} style={styles.logoutButton}>
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.authLink}>
                            Iniciar Sesión
                        </Link>

                        <Link to="/register" style={styles.registerButton}>
                            Crear Cuenta
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

// 🎨 Estilos Cinemáticos Surrealistas
const styles: { [key: string]: React.CSSProperties } = {
    nav: {
        position: "relative",
        padding: "15px 45px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        background: "rgba(10, 0, 25, 0.45)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.16)",
        boxShadow: "0 0 25px rgba(120, 60, 255, 0.25)",
        zIndex: 100,
    },

    // Línea luminosa debajo del nav
    glowBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "3px",
        background: "linear-gradient(90deg, #ff5de6, #9f79ff, #57d9ff)",
        boxShadow: "0 0 15px rgba(165, 120, 255, 0.7)",
    },

    logoContainer: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },

    logoIcon: {
        color: "#ff70e0",
        filter: "drop-shadow(0 0 8px rgba(255, 100, 200, 0.8))",
    },

    logoText: {
        fontSize: "1.7em",
        fontWeight: 900,
        background: "linear-gradient(120deg, #ff70e0, #a770ff, #57d0ff)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textDecoration: "none",
        letterSpacing: "1.5px",
        textShadow: "0 0 10px rgba(255, 150, 255, 0.4)",
    },

    linksContainer: {
        display: "flex",
        alignItems: "center",
        gap: "28px",
    },

    navLink: {
        color: "#d8cfff",
        fontSize: "1em",
        textDecoration: "none",
        transition: "0.25s",
        padding: "5px 10px",
        borderRadius: "6px",
    },

    userInfo: {
        color: "#dcd2ff",
        fontSize: "1em",
        fontWeight: 400,
    },

    username: {
        color: "#ff9bee",
        fontWeight: 700,
        textShadow: "0 0 8px rgba(255, 120, 255, 0.6)",
    },

    logoutButton: {
        padding: "8px 15px",
        borderRadius: "8px",
        border: "1px solid rgba(255, 80, 120, 0.8)",
        background: "rgba(255, 80, 120, 0.08)",
        color: "#ff7ea8",
        cursor: "pointer",
        boxShadow: "0 0 12px rgba(255, 100, 150, 0.35)",
        backdropFilter: "blur(6px)",
    },

    authLink: {
        color: "#d8cfff",
        textDecoration: "none",
        fontSize: "1em",
    },

    registerButton: {
        padding: "10px 18px",
        borderRadius: "10px",
        border: "none",
        background: "linear-gradient(135deg, #ff5de6, #9f79ff, #57d9ff)",
        color: "white",
        fontSize: "1em",
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 0 15px rgba(165, 120, 255, 0.6)",
        textDecoration: "none",
    },
};

export default NavBar;
