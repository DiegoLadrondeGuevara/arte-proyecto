// src/pages/GenerateArtPage.tsx — Versión Cinemática & Surrealista
import React, { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUploadUrl, uploadFileToS3, generateArt } from '../api/image';

const S3_BUCKET_BASE_URL =
    'https://api-gestion-usuarios-dev-images-851725327526.s3.amazonaws.com/';

const GenerateArtPage: React.FC = () => {
    const { token, user } = useAuth();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState('Esperando imagen...');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImageKey, setGeneratedImageKey] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setSelectedFileType(file.type);
            setGeneratedImageKey(null);
            setStatusMessage(`Archivo seleccionado: ${file.name}`);
        }
    };

    const handleGenerateArt = useCallback(async () => {
        if (!selectedFile || !token || !selectedFileType || !user) {
            setStatusMessage('❌ Necesitas seleccionar un archivo e iniciar sesión.');
            return;
        }

        setIsLoading(true);
        setGeneratedImageKey(null);

        try {
            setStatusMessage('1/3: Solicitando permiso al universo…');

            const { uploadUrl, s3Key } = await getUploadUrl(token, selectedFile.name);

            setStatusMessage('2/3: Elevando la imagen hacia la nube…');
            await uploadFileToS3(uploadUrl, selectedFile);

            setStatusMessage('3/3: Invocando la IA para transmutar tu arte…');

            const aiResponse = await generateArt(token, s3Key);

            setStatusMessage(`✨ Arte generado. Prompt usado: "${aiResponse.prompt_used}"`);
            setGeneratedImageKey(aiResponse.new_image_key);
        } catch (err) {
            setStatusMessage('❌ Error en la generación. Revisa la consola.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedFile, selectedFileType, token, user]);

    const imageUrl = generatedImageKey
        ? `${S3_BUCKET_BASE_URL}${generatedImageKey}`
        : '';

    const userName = (user as { name?: string })?.name || 'Artista';

    return (
        <div style={styles.container}>
            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }

                    @keyframes neonPulse {
                        0% { box-shadow: 0 0 12px rgba(160, 80, 255, 0.5); }
                        50% { box-shadow: 0 0 22px rgba(255, 120, 255, 0.8); }
                        100% { box-shadow: 0 0 12px rgba(160, 80, 255, 0.5); }
                    }
                `}
            </style>

            <div style={styles.card}>
                <h2 style={styles.title}>Generador de Arte 🔮</h2>

                <p style={styles.subtitle}>
                    {user ? (
                        <>Bienvenido, <span style={styles.username}>{userName}</span>.  
                        Eleva tu imagen y deja que la IA la descomponga en arte conceptual.</>
                    ) : (
                        'Debes iniciar sesión para usar el generador galáctico.'
                    )}
                </p>

                {/* Área de subida */}
                <div style={styles.uploadArea}>
                    <label htmlFor="file-upload" style={styles.fileLabel}>
                        {selectedFile
                            ? `📁 Archivo seleccionado: ${selectedFile.name}`
                            : '✨ Seleccionar Imagen del Rostro'}
                    </label>

                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        style={styles.hiddenFileInput}
                    />

                    <button
                        onClick={handleGenerateArt}
                        disabled={!selectedFile || isLoading || !token}
                        style={styles.button}
                    >
                        {isLoading ? (
                            <div style={styles.loadingContainer}>
                                <div style={styles.spinner}></div>
                                <span style={{ marginLeft: 10 }}>
                                    Transformando Arte…
                                </span>
                            </div>
                        ) : (
                            'Transformar en Arte Conceptual 🎨'
                        )}
                    </button>
                </div>

                <p style={styles.statusMessage}>{statusMessage}</p>

                {imageUrl && (
                    <div style={styles.resultContainer}>
                        <h3 style={styles.resultTitle}>Resultado Final</h3>
                        <img
                            src={imageUrl}
                            style={styles.resultImage}
                            alt="Resultado generado"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

/* ===========================================================
   🎨 ESTÉTICA NEÓN + GLASSMORPHISM + SURREALISMO CINEMÁTICO
   =========================================================== */
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '60px',
        background: 'linear-gradient(135deg, #0a0018 0%, #120027 60%, #1f003a 100%)',
        backgroundSize: '200% 200%',
    },

    card: {
        width: '680px',
        padding: '40px',
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        color: 'white',
        boxShadow: '0 0 28px rgba(160, 80, 255, 0.35)',
        animation: 'neonPulse 6s infinite',
        textAlign: 'center',
    },

    title: {
        fontSize: '2.5em',
        fontWeight: 800,
        marginBottom: 10,
        background: 'linear-gradient(120deg, #ff70e0, #ca6bff, #70b6ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 14px rgba(255, 120, 255, 0.45)',
    },

    subtitle: {
        fontSize: '1.1em',
        color: '#d0c6ff',
        marginBottom: 28,
        lineHeight: 1.5,
    },

    username: {
        color: '#ff9bf0',
        fontWeight: 700,
    },

    uploadArea: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
    },

    hiddenFileInput: { display: 'none' },

    fileLabel: {
        padding: '16px',
        borderRadius: '10px',
        border: '2px dashed #9f70ff',
        background: 'rgba(150, 70, 255, 0.12)',
        color: '#d8b7ff',
        fontSize: '1.05em',
        cursor: 'pointer',
        transition: '0.25s',
    },

    button: {
        padding: '16px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.15em',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #ff5de6, #a770ff, #57d9ff)',
        color: 'white',
        boxShadow: '0 0 16px rgba(160, 80, 255, 0.55)',
    },

    statusMessage: {
        marginTop: 14,
        fontSize: '1.05em',
        color: '#ffbb9b',
        minHeight: 28,
        textShadow: '0 0 6px rgba(255, 150, 120, 0.4)',
    },

    resultContainer: {
        marginTop: 30,
        borderTop: '1px solid rgba(255, 255, 255, 0.15)',
        paddingTop: 20,
    },

    resultTitle: {
        fontSize: '1.4em',
        color: '#a770ff',
        marginBottom: 18,
        textShadow: '0 0 8px rgba(167, 112, 255, 0.5)',
    },

    resultImage: {
        maxWidth: '100%',
        borderRadius: 14,
        border: '3px solid #a770ff',
        boxShadow: '0 0 24px rgba(167,112,255,0.8)',
    },

    // Loader neon spinner
    loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinner: {
        width: 22,
        height: 22,
        borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.25)',
        borderTop: '3px solid #fff',
        animation: 'spin 0.9s linear infinite',
    },
};

export default GenerateArtPage;
