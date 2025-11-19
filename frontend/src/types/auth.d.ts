// src/types/auth.d.ts

/** Define la estructura de los datos que guardamos del usuario en el frontend. */
export interface User {
  user_id: string;
  email: string;
  username: string;
  // Puedes añadir aquí la carpeta S3 si la necesitas en el frontend, aunque se puede calcular:
  // s3_folder: string; 
}

/** * Define la estructura de la respuesta que tu API devuelve
 * en los endpoints de /register y /login.
 */
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

/** * Define la estructura de los datos que se envían para el REGISTRO.
 * Se alinea con lo que espera tu función register.py.
 */
export interface RegisterCredentials {
  email: string;
  user: string; // La API espera la clave 'user' para el nombre de usuario
  password: string;
}

/** * Define la estructura de los datos que se envían para el LOGIN.
 * Se alinea con lo que espera tu función login.py.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}