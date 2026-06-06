# CarZone

Concesionario virtual de vehículos de alta gama desarrollado como Trabajo de Fin de Grado de DAW.

Permite explorar un catálogo premium, solicitar financiaciones, reservar citas de taller y recibir asistencia de un chatbot con inteligencia artificial. Los empleados y administradores disponen de un panel de gestión completo.

![Angular](https://img.shields.io/badge/Angular-18-DD0031?style=flat-square&logo=angular&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white)
![Pytest](https://img.shields.io/badge/Pytest-3776AB?style=flat-square&logo=python&logoColor=white)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green?style=flat-square)

---

## Arquitectura

```
Navegador
    │
    ▼
[Nginx Proxy] ← Puerto 443 (HTTPS)
    │
    ├──► [Angular / Nginx]   → Interfaz de usuario
    │
    └──► [Laravel / Apache]  → API REST + OAuth con Google
                │
                ▼
           [MySQL 8]         → Base de datos
```

El proxy Nginx recibe todas las peticiones. Las que van a `/api/` las reenvía al backend de Laravel. El resto las sirve el frontend de Angular.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | Angular 18 + Nginx |
| Backend | Laravel 11 + Apache |
| Base de datos | MySQL 8 |
| Proxy / HTTPS | Nginx con certificado SSL autofirmado |
| Contenedores | Docker + Docker Compose |
| Tests | Python + Pytest |
| IA | Google Gemini API |
| Autenticación | Google OAuth |

---

## Requisitos previos

Solo necesitas tener instalado **Docker Desktop**. No hace falta instalar Node, PHP ni ninguna otra herramienta.

- [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Puesta en marcha

### 1. Configura Git (solo Windows — importante)

En Windows, Git convierte los saltos de línea al clonar, lo que rompe los scripts de arranque de Docker. Ejecuta esto **antes de clonar**:

```bash
git config --global core.autocrlf false
```

### 2. Clona el repositorio

```bash
git clone https://github.com/R1ul09/CARZONE.git
cd carzone
```

### 3. Configura el entorno del backend

```bash
cp carzone-api/.env.example carzone-api/.env
```

Abre `carzone-api/.env` y rellena estos dos campos:

```env
MAIL_USERNAME=       # Tu usuario de Mailtrap (mailtrap.io — gratis)
MAIL_PASSWORD=       # Tu contraseña de Mailtrap

GEMINI_API_KEY=      # Tu API key de Gemini (aistudio.google.com — gratis)

GOOGLE_CLIENT_ID=      # Tu Client ID de Google OAuth (console.cloud.google.com)
GOOGLE_CLIENT_SECRET=  # Tu Client Secret de Google OAuth
```

> El resto de variables ya están configuradas para Docker. No tocar nada más.

### 4. Levanta la aplicación

```bash
docker compose up --build
```

La primera vez tardará unos minutos descargando imágenes y compilando. Las siguientes veces será mucho más rápido gracias a la caché de Docker.

Cuando aparezca `>>> [4/4] Arrancando Apache...` en los logs, la aplicación está lista.

### 5. Abre el navegador

Accede a **https://localhost**

> El navegador mostrará un aviso de certificado autofirmado. Haz clic en **Avanzado → Continuar de todos modos**.

---

## Credenciales de demo

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@carzone.com | Carzone1234. |
| Empleado | empleado@carzone.com | Carzone1234. |
| Cliente | cliente@carzone.com | Carzone1234. |

---

## Tests automatizados

El proyecto incluye una suite de 70 tests con pytest que cubren autenticación, permisos por rol, catálogo, citas, financiaciones y servicios.

Requiere tener Python instalado: [python.org](https://www.python.org/downloads/)

Con Docker levantado, desde la carpeta `tests/`:

```bash
pip install -r requirements.txt
pytest
```

Al terminar se genera un `informe.html` en la carpeta `tests/` con el resultado visual completo.

---

## Comandos útiles

```bash
# Levantar en segundo plano
docker compose up --build -d

# Ver los logs en tiempo real
docker compose logs -f

# Parar los contenedores (conserva los datos de la BD)
docker compose down

# Parar y borrar la BD para empezar desde cero
docker compose down -v
```

---

## Notas

- La base de datos se inicializa automáticamente la primera vez con todas las migrations y datos de demo. No es necesario ejecutar ningún comando adicional.
- Los certificados SSL se generan automáticamente al arrancar si no existen.
- Las imágenes de los vehículos están incluidas en el repositorio dentro de `carzone-api/storage/app/public/`.
- Si al entrar después de reiniciar Docker aparece un error de sesión, cierra sesión y vuelve a entrar — es el comportamiento esperado al reiniciar la base de datos.