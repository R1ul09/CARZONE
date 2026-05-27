# CarZone 🚗

Concesionario virtual de vehículos de alta gama desarrollado como Trabajo de Fin de Grado.

Permite a los usuarios explorar un catálogo de coches, solicitar financiaciones, reservar citas de taller y recibir asistencia de un chatbot con inteligencia artificial. Los empleados y administradores disponen de un panel de gestión completo.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | Angular + Nginx |
| Backend | Laravel 11 + Apache |
| Base de datos | MySQL 8 |
| Proxy / HTTPS | Nginx con certificado autofirmado |
| Contenedores | Docker + Docker Compose |
| IA | Google Gemini API |

---

## Requisitos previos

Solo necesitas tener instalado **Docker Desktop** en tu máquina.

- [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Puesta en marcha

### 1. Clona el repositorio

```bash
git clone https://github.com/R1ul09/CARZONE.git
cd carzone
```

### 2. Configura el entorno del backend

Copia el archivo de ejemplo y rellena tus credenciales:

```bash
cp carzone-api/.env.example carzone-api/.env
```

Abre `carzone-api/.env` y rellena estos dos campos:

```env
MAIL_USERNAME=       # Tu usuario de Mailtrap (mailtrap.io)
MAIL_PASSWORD=       # Tu contraseña de Mailtrap

GEMINI_API_KEY=      # Tu API key de Google Gemini (aistudio.google.com)
```

> El resto de variables ya están configuradas para funcionar con Docker.

### 3. Levanta la aplicación

```bash
docker compose up --build
```

La primera vez tardará unos minutos porque Docker descargará las imágenes y compilará el proyecto. Las siguientes veces será mucho más rápido.

Cuando veas el mensaje `Apache arrancando...` en los logs, la aplicación está lista.

### 4. Accede a la aplicación

Abre tu navegador y ve a **https://localhost**

> El navegador mostrará un aviso de seguridad porque el certificado SSL es autofirmado (para desarrollo). Haz clic en "Avanzado" → "Continuar" para acceder.

---

## Credenciales de demo

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@carzone.com | carzone1234 |
| Empleado | empleado@carzone.com | carzone1234 |
| Cliente | cliente@carzone.com | carzone1234 |

---

## Arquitectura

```
Navegador
    │
    ▼
[Nginx Proxy] ← Puerto 443 (HTTPS)
    │
    ├──► [Angular / Nginx]  → Interfaz de usuario
    │
    └──► [Laravel] → API REST
              │
              ▼
          [MySQL 8] → Base de datos
```

El proxy Nginx recibe todas las peticiones. Las que van a `/api/` las reenvía al backend de Laravel. El resto las sirve el frontend de Angular.

---

## Comandos útiles

```bash
# Levantar en segundo plano
docker compose up --build -d

# Ver los logs en tiempo real
docker compose logs -f

# Parar todos los contenedores
docker compose down

# Parar y borrar también los datos de la base de datos
docker compose down -v
```

---

## Notas

- La base de datos se inicializa automáticamente la primera vez que se levanta el proyecto. No es necesario ejecutar ningún comando de migrations o seeders manualmente.
- Las imágenes de los vehículos están incluidas en el repositorio dentro de `carzone-api/storage/app/public/`.
- El certificado SSL es autofirmado, válido únicamente para entorno de desarrollo local.