// src/components/ui/NavBar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Icono SVG simple
const PaintBrushIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
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
    const {logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { path: '/', label: 'Dashboard', requiresAuth: true },
        { path: '/generate', label: 'Generar Arte', requiresAuth: true },
    ];

    // Detectar nombre seguro
    const username =
        user?.username || user?.email || "Artista";

    return (
        <nav style={styles.nav}>
            {/* Logo */}
            <div style={styles.logoContainer}>
                <PaintBrushIcon style={styles.logoIcon} />
                <Link
                    to={user ? "/" : "/login"}
                    style={styles.logoText}
                >
                    ArtFlow AI
                </Link>
            </div>

            {/* Links */}
            <div style={styles.linksContainer}>
                {user ? (
                    <>
                        {navLinks.map((link) => (
                            <Link key={link.path} to={link.path} style={styles.navLink}>
                                {link.label}
                            </Link>
                        ))}

                        {/* Usuario */}
                        <span style={styles.userInfo}>
                            Hola, <span style={styles.username}>{username}</span>
                        </span>

                        <button onClick={handleLogout} style={styles.logoutButton}>
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.loginLink}>
                            Iniciar Sesión
                        </Link>
                        <Link to="/register" style={styles.registerButton}>
                            Registrarse
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

// Estilos
const styles: { [key: string]: React.CSSProperties } = {
    nav: {
        backgroundColor: '#1f1c2c',
        padding: '15px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid rgba(167, 112, 255, 0.2)',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
    },
    logoIcon: {
        color: '#ff9b71',
        marginRight: '10px',
        filter: 'drop-shadow(0 0 5px rgba(255, 155, 113, 0.6))',
    },
    logoText: {
        fontSize: '1.5em',
        fontWeight: 700,
        background: 'linear-gradient(90deg, #a770ff, #e75a7c)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textDecoration: 'none',
    },
    linksContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '25px',
    },
    navLink: {
        color: '#b0b0d0',
        textDecoration: 'none',
        fontSize: '1em',
    },
    userInfo: {
        color: '#e0e0e0',
        fontSize: '0.95em',
    },
    username: {
        color: '#ff9b71',
        fontWeight: 600,
    },
    loginLink: {
        color: '#b0b0d0',
        textDecoration: 'none',
        fontSize: '1em',
    },
    registerButton: {
        padding: '8px 15px',
        borderRadius: '5px',
        border: 'none',
        background: 'linear-gradient(45deg, #6c5ce7 0%, #a770ff 100%)',
        color: 'white',
        fontSize: '1em',
        fontWeight: 600,
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: '0 2px 10px rgba(108, 92, 231, 0.4)',
    },
    logoutButton: {
        padding: '8px 15px',
        borderRadius: '5px',
        border: '1px solid #ff6b6b',
        backgroundColor: 'transparent',
        color: '#ff6b6b',
        fontSize: '0.95em',
        cursor: 'pointer',
    }
};

export default NavBar;
