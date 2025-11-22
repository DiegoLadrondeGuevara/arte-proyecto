// src/api/image.ts
import axios from 'axios';

// ⚠️ URL base correcta
const API_BASE_URL = 'https://rjxs7mob98.execute-api.us-east-1.amazonaws.com/dev';

interface UploadUrlResponse {
    uploadUrl: string;
    s3Key: string;
}

/**
 * Extraer x-amz-security-token desde la URL firmada.
 */
function extractSecurityToken(url: string): string | null {
    try {
        const urlParams = new URLSearchParams(new URL(url).search);
        return urlParams.get('x-amz-security-token');
    } catch (e) {
        console.error("Error al parsear la URL para extraer token.", e);
        return null;
    }
}

/**
 * 1. Solicitar URL firmada al backend.
 */
export async function getUploadUrl(
    token: string,
    fileName: string,
    fileType: string
): Promise<UploadUrlResponse> {

    const response = await axios.post<UploadUrlResponse>(
        `${API_BASE_URL}/images/upload-url`,
        { fileName, fileType },
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
 * 2. Subir archivo a S3 usando la URL firmada.
 */
export async function uploadFileToS3(
    uploadUrl: string,
    file: File,
): Promise<void> {

    const securityToken = extractSecurityToken(uploadUrl);

    const headers: Record<string, string> = {
        'Content-Type': 'image/jpeg',
    };

    if (securityToken) {
        headers['x-amz-security-token'] = securityToken;
    }

    await axios.put(uploadUrl, file, { headers });
}

interface GenerateArtResponse {
    message: string;
    prompt_used: string;
    new_image_key: string;
}

/**
 * 3. Llamar al backend para generar arte AI.
 */
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
