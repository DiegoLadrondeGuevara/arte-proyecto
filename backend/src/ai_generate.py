import json
import boto3
import os
import requests
import time
import replicate

# --- Clientes AWS ---
rekognition_client = boto3.client('rekognition')
secrets_client = boto3.client('secretsmanager')
s3_client = boto3.client('s3')

# --- Variables de entorno ---
S3_BUCKET_NAME = os.environ.get('S3_BUCKET_NAME')
EXTERNAL_SECRET_NAME = os.environ.get('EXTERNAL_SECRET_NAME', 'ExternalApiKeySecret-dev')

def get_api_token():
    """Devuelve token de Replicate. Si no hay secreto, usa fallback."""
    try:
        response = secrets_client.get_secret_value(SecretId=EXTERNAL_SECRET_NAME)
        token = response['SecretString']
        print("🟢 Token Replicate obtenido desde Secrets Manager")
        return token
    except Exception as e:
        print(f"⚠️ No se pudo obtener token de Secrets Manager, usando fallback: {e}")
        # Fallback con tu token nuevo
        return "r8_54y4lr1mz2ZUgqrIB9xIHs9KnboSc7C2zmNKl"

def analyze_image_rekognition(bucket, key):
    """Genera prompt base usando Rekognition."""
    try:
        labels_resp = rekognition_client.detect_labels(
            Image={'S3Object': {'Bucket': bucket, 'Name': key}},
            MaxLabels=10
        )
        labels = [l['Name'] for l in labels_resp['Labels']]
        
        faces_resp = rekognition_client.detect_faces(
            Image={'S3Object': {'Bucket': bucket, 'Name': key}},
            Attributes=['ALL']
        )
        emotions = []
        if faces_resp['FaceDetails']:
            for face in faces_resp['FaceDetails']:
                emotions.extend([emo['Type'] for emo in face['Emotions'] if emo['Confidence'] > 90])
        
        feeling = emotions[0].lower() if emotions else 'serenity and contemplation'
        scene = labels[0].lower() if labels else 'an abstract shape'
        
        prompt = f"A vibrant digital painting in Van Gogh style, featuring {scene}, emotion: {feeling}, 4k, artistic."
        print("DEBUG Prompt generado:", prompt)
        return prompt
    except Exception as e:
        print("⚠️ Error Rekognition:", e)
        return "A beautiful abstract art piece with emotional depth, hyper-detailed."

def generate_image_replicate(prompt, token):
    """Genera imagen con Replicate y maneja errores."""
    try:
        client = replicate.Client(api_token=token)
        model_version = "stability-ai/stable-diffusion:9a29a4c0299d5529f79612394593c66f616016a2d9806a654c6017367c3b1716"
        output = client.run(model_version, input={"prompt": prompt, "width": 768, "height": 768, "num_outputs": 1})
        if output and isinstance(output, list) and output[0].startswith("http"):
            print("🟢 URL de imagen generada:", output[0])
            return output[0]
        raise Exception("Replicate no devolvió URL válida")
    except Exception as e:
        print("⚠️ Error Replicate:", e)
        return None

def lambda_handler(event, context):
    cors_headers = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}

    try:
        body = json.loads(event.get('body', '{}'))
        s3_key = body.get('s3KeyToAnalyze')
        user_id = body.get('userId', 'anonymous')

        if not s3_key:
            return {'statusCode': 400, 'headers': cors_headers, 'body': json.dumps({'error': 'Falta s3KeyToAnalyze'})}

        # 1️⃣ Obtener token Replicate
        token = get_api_token()

        # 2️⃣ Generar prompt
        prompt = analyze_image_rekognition(S3_BUCKET_NAME, s3_key)

        # 3️⃣ Generar imagen
        image_url = generate_image_replicate(prompt, token)
        if not image_url:
            return {'statusCode': 500, 'headers': cors_headers, 'body': json.dumps({'error': 'Fallo generación IA'})}

        # 4️⃣ Descargar y guardar en S3
        try:
            image_data = requests.get(image_url, timeout=60).content
            processed_key = f"users/{user_id}/processed/arte-ia-{int(time.time())}.jpg"
            s3_client.put_object(Bucket=S3_BUCKET_NAME, Key=processed_key, Body=image_data, ContentType='image/jpeg')
        except Exception as e:
            print("⚠️ Error guardando en S3:", e)
            return {'statusCode': 500, 'headers': cors_headers, 'body': json.dumps({'error': 'No se pudo guardar imagen en S3', 'details': str(e)})}

        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps({'message': 'Imagen generada y guardada', 'prompt_used': prompt, 'new_image_key': processed_key})
        }

    except Exception as e:
        print("🔥 Error Lambda ai_generate:", e)
        return {'statusCode': 500, 'headers': cors_headers, 'body': json.dumps({'error': 'Error interno', 'details': str(e)})}
