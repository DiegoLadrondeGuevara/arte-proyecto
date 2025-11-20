// src/api/image.ts
import axios from 'axios';

// ⚠️ Asegúrate de que esta URL base esté correcta (debe ser la misma que en auth.ts)
const API_BASE_URL = 'https://rjxs7mob98.execute-api.us-east-1.amazonaws.com/dev';

/**
 * Define la respuesta esperada de la API para obtener una URL de subida.
 */
interface UploadUrlResponse {
  uploadUrl: string; // La URL firmada para hacer el PUT a S3
  s3Key: string;     // La clave (ruta) donde se guardará el archivo en S3
}

/**
 * 1. Obtiene una URL firmada de tu Lambda para subir un archivo directamente a S3.
 * @param token - Token JWT del usuario autenticado.
 * @param fileName - Nombre original del archivo (e.g., "foto.jpg").
 * @param fileType - Tipo MIME del archivo (e.g., "image/jpeg").
 */
export async function getUploadUrl(
  token: string,
  fileName: string,
  fileType: string
): Promise<UploadUrlResponse> {
  // Mantenemos el fileType aquí para no romper la interfaz
  const response = await axios.post<UploadUrlResponse>(
    `${API_BASE_URL}/images/upload-url`,
    { fileName, fileType }, // Body de la solicitud POST
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}

/**
 * 2. Sube la imagen real al bucket de S3 usando la URL firmada.
 * Nota: Esta llamada NO va a tu API Gateway, va DIRECTO a S3.
 * 🔥 CORRECCIÓN: Eliminamos el bloque headers. Permitimos que Axios determine 
 * el Content-Type automáticamente (el comportamiento por defecto).
 * @param uploadUrl - La URL firmada obtenida de tu Lambda.
 * @param file - El objeto File de JavaScript.
 */
export async function uploadFileToS3(
  uploadUrl: string,
  file: File,
): Promise<void> {
  // Sube el archivo sin encabezados personalizados
  await axios.put(uploadUrl, file);
}

/**
 * 3. Llama a la Lambda para generar el arte AI después de que la imagen esté en S3.
 * @param token - Token JWT del usuario autenticado.
 * @param s3KeyToAnalyze - La clave S3 del archivo que acaba de subir.
 */
interface GenerateArtResponse {
  message: string;
  prompt_used: string;
  new_image_key: string; // Clave S3 de la imagen generada
}

export async function generateArt(
  token: string,
  s3KeyToAnalyze: string
): Promise<GenerateArtResponse> {
  const response = await axios.post<GenerateArtResponse>(
    `${API_BASE_URL}/images/generate`,
    { s3KeyToAnalyze },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}
