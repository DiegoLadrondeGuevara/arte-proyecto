1️⃣ POST /upload-image

Función: Subir la foto del usuario, analizar emociones y guardar resultados.

Flujo Lambda:

Recibir la imagen como multipart/form-data o base64 desde el frontend.

Guardarla en un bucket de S3 (user-uploads/).

Llamar a Amazon Rekognition para análisis de rostro y emociones:

rekognition = boto3.client('rekognition')
response = rekognition.detect_faces(
    Image={'S3Object': {'Bucket': BUCKET_NAME, 'Name': filename}},
    Attributes=['ALL']
)
emotion = response['FaceDetails'][0]['Emotions'][0]['Type']


Guardar en DynamoDB la referencia de la imagen y la emoción detectada.

Respuesta:

{
  "image_url": "https://bucket.s3.amazonaws.com/user-uploads/imagen1.jpg",
  "emotion": "HAPPY"
}

2️⃣ GET /generate-image

Función: Generar una imagen según la emoción detectada usando IA (DALL·E, DeepAI, etc.).

Flujo Lambda:

Recibir emotion como parámetro GET o del registro en DynamoDB.

Llamar a la API de generación de imágenes IA:

import requests
data = {"prompt": f"Draw a {emotion.lower()} scene"}
r = requests.post(IA_API_URL, headers={"Authorization": "Bearer API_KEY"}, json=data)
image_base64 = r.json()['image']


Guardar la imagen generada en S3 (generated-images/).

Guardar la referencia en DynamoDB asociada al usuario.

Respuesta:

{
  "generated_image_url": "https://bucket.s3.amazonaws.com/generated-images/imagen1.jpg"
}

3️⃣ GET /generate-melody

Función: Generar una melodía basada en la emoción.

Flujo Lambda:

Recibir emotion como parámetro.

Llamar a un servicio de IA musical (AIVA, Amper, OpenAI MuseNet, etc.).

Guardar la melodía generada en S3 (generated-melodies/).

Guardar referencia en DynamoDB asociada al usuario.

Respuesta:

{
  "melody_url": "https://bucket.s3.amazonaws.com/generated-melodies/melody1.mp3"
}

4️⃣ GET /gallery

Función: Obtener todas las imágenes y melodías asociadas al usuario.

Flujo Lambda:

Recibir user_id desde el token JWT.

Consultar DynamoDB para obtener todos los registros de ese usuario: imágenes subidas, imágenes generadas y melodías.

Retornar un JSON con URLs de S3:

Respuesta:

{
  "uploads": [
    {
      "original_image": "...",
      "emotion": "...",
      "generated_image": "...",
      "melody": "..."
    }
  ]
}