import React, { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
// Asegúrate de que esta importación de uploadFileToS3 haya sido actualizada
// para aceptar el argumento 'fileType' (como se corrigió en el paso anterior).
import { getUploadUrl, uploadFileToS3, generateArt } from '../api/image';

const S3_BUCKET_BASE_URL =
    'https://api-gestion-usuarios-dev-images-851725327526.s3.amazonaws.com/';

const GenerateArtPage: React.FC = () => {
    const { token, user } = useAuth();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // 💡 Nuevo estado para guardar el Content-Type para la subida
    const [selectedFileType, setSelectedFileType] = useState<string | null>(null); 
    const [statusMessage, setStatusMessage] = useState<string>('Esperando imagen...');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [generatedImageKey, setGeneratedImageKey] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            // 💡 Almacenar el tipo de archivo
            setSelectedFileType(file.type); 
            setGeneratedImageKey(null);
            setStatusMessage(`Archivo seleccionado: ${file.name}`);
        }
    };

    const handleGenerateArt = useCallback(async () => {
        if (!selectedFile || !token || token.length === 0 || !user || !selectedFileType) {
            setStatusMessage('Error: Necesitas seleccionar un archivo e iniciar sesión.');
            return;
        }

        console.log(
            'DEBUG TOKEN: Token a enviar (Inicio/Fin):',
            token.substring(0, 10) + '...' + token.substring(token.length - 10)
        );

        setIsLoading(true);
        setGeneratedImageKey(null);

        try {
            setStatusMessage('1/3: Solicitando URL de subida a la API...');

            // 1. Solicitar URL prefirmada
            const { uploadUrl, s3Key } = await getUploadUrl(
                token,
                selectedFile.name,
            );

            console.log('DEBUG S3: URL Prefirmada recibida.');

            setStatusMessage('2/3: Subiendo imagen directamente a S3...');
            
            // 2. Subir archivo a S3
            // 💡 CLAVE: Pasamos el selectedFileType para que uploadFileToS3 lo use
            // como Content-Type en la cabecera del PUT, garantizando la coincidencia con la firma.
            await uploadFileToS3(uploadUrl, selectedFile);

            console.log('DEBUG S3: Subida directa a S3 exitosa.');

            setStatusMessage(
                '3/3: Subida exitosa. Llamando a la IA (puede tardar hasta 29s)...'
            );
            
            console.log('DEBUG REQUEST: Preparando llamada a generateArt');
            console.log('URL:', 'https://2i4in2nwq6.execute-api.us-east-1.amazonaws.com/dev/images/generate');
            console.log('S3 Key a analizar:', s3Key);
            console.log('Token:', token ? token.substring(0, 10) + '...' + token.substring(token.length - 10) : 'no hay token');

            // 3. Llamar al pipeline de IA
            const aiResponse = await generateArt(token, s3Key);

            setStatusMessage(
                `✅ ¡Arte generado! Prompt usado: "${aiResponse.prompt_used}"`
            );
            setGeneratedImageKey(aiResponse.new_image_key);
        } catch (error: unknown) {
            console.error('Error en el pipeline de IA:', error);

            // Type-narrowing seguro
            const err = error as {
                response?: { status?: number; data?: { message?: string } };
            };

            if (
                err.response?.status === 500 &&
                err.response.data?.message === 'Missing Authentication Token'
            ) {
                setStatusMessage(
                    '❌ Error de Autenticación (500). Asegúrate de que tu token sea válido.'
                );
            } else {
                setStatusMessage(
                    '❌ Error fatal en la generación de arte. Verifique los logs de la consola.'
                );
            }
        } finally {
            setIsLoading(false);
        }
    }, [selectedFile, selectedFileType, token, user]); // Dependencias actualizadas

    const imageUrl = generatedImageKey
        ? `${S3_BUCKET_BASE_URL}${generatedImageKey}`
        : '';

    const userName = (user as { name?: string })?.name || 'Usuario';

    return (
        <div style={styles.container}>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>

            <div style={styles.card}>
                <h2 style={styles.title}>Generador de Arte Neón 🎨</h2>

                <p style={styles.subtitle}>
                    {user
                        ? `¡Hola, ${userName}! Sube una imagen para desatar la metamorfosis digital.`
                        : 'Inicia sesión para usar el generador de IA.'}
                </p>

                <div style={styles.uploadArea}>
                    <label htmlFor="file-upload" style={styles.fileLabel}>
                        {selectedFile
                            ? `Archivo: ${selectedFile.name}`
                            : 'Seleccionar Imagen Original'}
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
                                <div style={styles.spinner} />
                                <span style={{ marginLeft: '10px' }}>
                                    Procesando Arte (
                                    {statusMessage.match(/\d\/\d/)?.[0] || '...'})
                                </span>
                            </div>
                        ) : (
                            'Analizar y Generar Arte 🔮'
                        )}
                    </button>
                </div>

                <p style={styles.statusMessage}>{statusMessage}</p>

                {imageUrl && (
                    <div style={styles.resultContainer}>
                        <h3 style={styles.resultTitle}>Resultado Final:</h3>
                        <img
                            src={imageUrl}
                            alt="Arte Generado por IA"
                            style={styles.imageResult}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

// ==== Estilos Optimzados (mejor spacing) ====
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        padding: '50px 0',
        minHeight: 'calc(100vh - 180px)',
    },
    card: {
        padding: '35px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '15px',
        boxShadow: '0 8px 32px 0 rgba(100, 100, 255, 0.3)',
        textAlign: 'center',
        width: '600px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        color: 'white',
    },
    title: {
        fontSize: '2.4em',
        fontWeight: 700,
        marginBottom: '10px',
        background: 'linear-gradient(90deg, #a770ff, #e75a7c, #ff9b71)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 5px rgba(255, 100, 255, 0.5)',
    },
    subtitle: {
        fontSize: '1em',
        color: '#b0b0d0',
        marginBottom: '20px',
    },
    uploadArea: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginTop: '5px',
    },
    hiddenFileInput: {
        display: 'none',
    },
    fileLabel: {
        padding: '15px',
        borderRadius: '8px',
        border: '2px dashed #6c5ce7',
        color: '#a770ff',
        backgroundColor: 'rgba(108, 92, 231, 0.1)',
        fontSize: '1em',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    button: {
        padding: '15px',
        borderRadius: '8px',
        border: 'none',
        background: 'linear-gradient(45deg, #6c5ce7 0%, #a770ff 100%)',
        color: 'white',
        fontSize: '18px',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(108, 92, 231, 0.5)',
        transition: 'opacity 0.3s, transform 0.1s',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusMessage: {
        fontSize: '1em',
        color: '#ff9b71',
        minHeight: '20px',
        fontWeight: 500,
        textShadow: '0 0 3px rgba(255, 155, 113, 0.3)',
        marginTop: '10px',
    },
    resultContainer: {
        marginTop: '20px',
        borderTop: '1px solid rgba(167, 112, 255, 0.3)',
        paddingTop: '15px',
    },
    resultTitle: {
        color: '#ff9b71',
        marginBottom: '15px',
    },
    imageResult: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '10px',
        border: '3px solid #6c5ce7',
        boxShadow: '0 0 20px rgba(108, 92, 231, 0.8)',
    },
    loadingContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    spinner: {
        border: '3px solid rgba(255, 255, 255, 0.3)',
        borderTop: '3px solid #fff',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        animation: 'spin 1s linear infinite',
    },
};

export default GenerateArtPage;