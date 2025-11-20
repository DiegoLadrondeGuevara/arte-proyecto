import React, { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
// Asumiendo que estas funciones existen en tu API
import { getUploadUrl, uploadFileToS3, generateArt } from '../api/image';

const S3_BUCKET_BASE_URL = 'https://api-gestion-usuarios-dev-images-bucket.s3.amazonaws.com/';

// NOTA IMPORTANTE: Si 'user' de useAuth() tiene una propiedad como 'username' o 'email',
// debes reemplazar 'name' con la propiedad correcta. Hemos usado 'name' como ejemplo común.

const GenerateArtPage: React.FC = () => {
    // 1. Estados
    const { token, user } = useAuth(); 
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('Esperando imagen...');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [generatedImageKey, setGeneratedImageKey] = useState<string | null>(null);

    // 2. Manejador de selección de archivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            setGeneratedImageKey(null);
            setStatusMessage(`Archivo seleccionado: ${e.target.files[0].name}`);
        }
    };

    // 3. Manejador del proceso completo
    const handleGenerateArt = useCallback(async () => {
        if (!selectedFile || !token || !user) {
            setStatusMessage('Error: Necesitas seleccionar un archivo e iniciar sesión.');
            return;
        }

        setIsLoading(true);
        setGeneratedImageKey(null);

        try {
            // --- PASO 1: Obtener la URL firmada de la Lambda ---
            setStatusMessage('1/3: Solicitando URL de subida a la API...');
            
            const { uploadUrl, s3Key } = await getUploadUrl(
                token,
                selectedFile.name,
                selectedFile.type
            );

            // --- PASO 2: Subir el archivo a S3 directamente ---
            setStatusMessage('2/3: Subiendo imagen directamente a S3...');
            await uploadFileToS3(uploadUrl, selectedFile);
            
            // --- PASO 3: Llamar a la Lambda de Generación IA ---
            setStatusMessage('3/3: Subida exitosa. Llamando a la IA (puede tardar hasta 29s)...');
            
            const aiResponse = await generateArt(token, s3Key);

            setStatusMessage(`✅ ¡Arte generado! Prompt usado: "${aiResponse.prompt_used}"`);
            setGeneratedImageKey(aiResponse.new_image_key);

        } catch (error) {
            console.error('Error en el pipeline de IA:', error);
            setStatusMessage('❌ Error fatal en la generación de arte. Verifique los logs de la consola.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedFile, token, user]);

    // Genera la URL completa de la imagen
    const imageUrl = generatedImageKey ? `${S3_BUCKET_BASE_URL}${generatedImageKey}` : '';

    // CORRECCIÓN 1: Manejo del nombre de usuario. 
    // Usamos 'as' para decirle a TypeScript que 'user' es (o puede ser tratado como) un objeto con 'name'.
    const userName = (user as { name?: string })?.name || 'Usuario';
    
    return (
        <div style={styles.container}>
            {/* CORRECCIÓN 2: Se inyectan los keyframes del spinner globalmente */}
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
                    {/* LÍNEA CORREGIDA PARA ACCEDER AL NOMBRE DE USUARIO */}
                    {user ? `¡Hola, ${userName}! Sube una imagen para desatar la metamorfosis digital.` : 'Inicia sesión para usar el generador de IA.'}
                </p>

                {/* Área de Selección de Archivo y Botón */}
                <div style={styles.uploadArea}>
                    
                    {/* El input de archivo está oculto y se activa con el label */}
                    <label htmlFor="file-upload" style={styles.fileLabel}>
                        {selectedFile ? `Archivo: ${selectedFile.name}` : 'Seleccionar Imagen Original'}
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        style={styles.hiddenFileInput}
                    />

                    {/* Botón de Generación */}
                    <button
                        onClick={handleGenerateArt}
                        disabled={!selectedFile || isLoading || !token}
                        style={styles.button}
                    >
                        {isLoading ? (
                            <div style={styles.loadingContainer}>
                                <div style={styles.spinner} />
                                <span style={{ marginLeft: '10px' }}>Procesando Arte ({statusMessage.match(/\d\/\d/)?.[0] || '...'})...</span>
                            </div>
                        ) : (
                            'Analizar y Generar Arte 🔮'
                        )}
                    </button>
                </div>
                
                {/* Mensaje de Estado */}
                <p style={styles.statusMessage}>{statusMessage}</p>

                {/* Área de Resultado de Imagen */}
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

// Estilos Artísticos (Consistentes con Login/Registro)
// NOTA: Se ha eliminado la segunda definición duplicada de 'styles' al final.
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        padding: '50px 0',
        minHeight: 'calc(100vh - 180px)', // Para que el fondo oscuro se vea
    },
    card: {
        padding: '50px',
        // Efecto "Frosted Glass" (Vidrio Esmerilado)
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '15px',
        boxShadow: '0 8px 32px 0 rgba(100, 100, 255, 0.3)', // Sombra neón
        textAlign: 'center',
        width: '600px',
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        color: 'white',
    },
    title: {
        fontSize: '2.5em',
        fontWeight: 700,
        marginBottom: '5px',
        // Degradado de texto neón
        background: 'linear-gradient(90deg, #a770ff, #e75a7c, #ff9b71)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 5px rgba(255, 100, 255, 0.5)',
    },
    subtitle: {
        fontSize: '1em',
        color: '#b0b0d0',
        marginBottom: '15px',
    },
    uploadArea: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    hiddenFileInput: {
        display: 'none',
    },
    fileLabel: {
        padding: '15px',
        borderRadius: '8px',
        border: '2px dashed #6c5ce7', // Borde punteado digital
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
        // Gradiente vibrante para el botón
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
        color: '#ff9b71', // Color neón para el estado
        minHeight: '20px',
        fontWeight: 500,
        textShadow: '0 0 3px rgba(255, 155, 113, 0.3)',
    },
    resultContainer: {
        marginTop: '30px',
        borderTop: '1px solid rgba(167, 112, 255, 0.3)',
        paddingTop: '20px',
    },
    resultTitle: {
        color: '#ff9b71',
        marginBottom: '15px',
    },
    imageResult: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '10px',
        border: '3px solid #6c5ce7', // Marco neón alrededor del resultado
        boxShadow: '0 0 20px rgba(108, 92, 231, 0.8)',
    },
    // Estilos para el spinner de carga (simple)
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