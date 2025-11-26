// src/api/image.ts
import axios from "axios";

const API_BASE_URL =
  "https://2i4in2nwq6.execute-api.us-east-1.amazonaws.com/dev";

interface UploadUrlResponse {
  uploadUrl: string;
  s3Key: string;
  expiresIn: number;
}

/**
 * 1. Solicitar URL firmada al backend.
 */
export async function getUploadUrl(
  token: string,
  fileName: string
): Promise<UploadUrlResponse> {
  console.log("🔵 [getUploadUrl] solicitando URL firmada…");
  console.log("➡️ fileName:", fileName);

  const response = await axios.post<UploadUrlResponse>(
    `${API_BASE_URL}/images/upload-url`,
    { fileName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: false,
    }
  );

  console.log("🟢 [getUploadUrl] Respuesta backend:", response.data);

  return response.data;
}

/**
 * 2. Subir archivo RAW a S3 con la URL firmada.
 */
export async function uploadFileToS3(uploadUrl: string, file: File): Promise<void> {
  console.log("🔵 [uploadFileToS3] iniciando subida a S3…");

  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
  });

  console.log("🟢 [uploadFileToS3] S3 respondió:", response.status);

  if (!response.ok) {
    const text = await response.text();
    console.error("❌ S3 error:", text);
    throw new Error("Error subiendo a S3");
  }
}

interface GenerateArtResponse {
  message: string;
  prompt_used: string;
  new_image_key: string;
}

/**
 * 3. Llamar al backend para generar arte AI
 */
export async function generateArt(
  token: string,
  s3KeyToAnalyze: string
): Promise<GenerateArtResponse> {
  console.log("🔵 [generateArt] solicitando generación AI…", s3KeyToAnalyze);

  const response = await axios.post<GenerateArtResponse>(
    `${API_BASE_URL}/images/generate`,
    { s3KeyToAnalyze },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: false,
    }
  );

  console.log("🟢 [generateArt] Respuesta backend:", response.data);

  return response.data;
}
