🚀 Guía de Configuración Local
Para que el proyecto funcione correctamente, sigue estos pasos:

# 1. Clonar el repositorio
git clone challange-house-of-CB
cd CHALLANGE/task-manager

# 2. Configurar variables de entorno
El proyecto necesita conectarse a Supabase. Como las credenciales son privadas, he dejado un archivo de ejemplo:

En la raíz del proyecto, crea un nuevo archivo llamado .env.local

Copia el contenido de .env.example y pégalo en tu nuevo archivo .env.local

Rellena los valores con las siguientes credenciales (que te enviaré por [correo/mensaje privado]):

Ejemplo de lo que verás en tu .env
NEXT_PUBLIC_SUPABASE_URL=https://tu-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
Nota para el evaluador: He omitido los valores reales en el repositorio por seguridad. Si necesitas las credenciales de prueba, por favor contacta conmigo.

# 3. Instalar y Correr
npm install

npm run dev

# Task Manager App

Web App de gestión de tareas, construida con **Next.js**, **React**, **TypeScript** y **Supabase**, para gestionar tareas de manera individual por usuario.

La aplicación permite:

- Registro e inicio de sesión
- Rutas protegidas para usuarios logueados
- Crear, listar, editar (inline), marcar completadas y eliminar tareas
- Logout
- Redirección automática si el usuario ya está logueado

---

## Tecnologías usadas

- **Next.js 13 (App Router)**  
- **React + TypeScript**  
- **Supabase** (Auth + PostgreSQL)  
- **CSS básico** (puede adaptarse a Tailwind si se desea)  

---
