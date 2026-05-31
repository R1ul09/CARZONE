# CarZone

Concesionario virtual de vehículos de alta gama desarrollado como Trabajo de Fin de Grado.

Permite a los usuarios explorar un catálogo de vehículos premium, solicitar financiaciones, reservar citas de taller y recibir asistencia de un chatbot con inteligencia artificial. Los empleados y administradores disponen de un panel de gestión completo.

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

Solo necesitas tener instalado **Docker Desktop** en tu máquina. No es necesario instalar Node, PHP, ni ninguna otra herramienta.

- [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Puesta en marcha

### 1. Configura Git (solo Windows — importante)

En Windows, Git convierte por defecto los saltos de línea al clonar, lo que rompe los scripts de arranque de Docker. Ejecuta esto **antes de clonar**:

```bash
git config --global core.autocrlf false
```

### 2. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/carzone.git
cd carzone
```

### 3. Configura el entorno del backend

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

> El resto de variables ya están configuradas para funcionar con Docker, no tocar nada más.

### 4. Levanta la aplicación

```bash
docker compose up --build
```

La primera vez tardará unos minutos porque Docker descargará las imágenes base y compilará el proyecto. Las siguientes veces será mucho más rápido gracias a la caché.

Cuando veas `>>> [4/4] Arrancando Apache...` en los logs, la aplicación está lista.

### 5. Accede a la aplicación

Abre tu navegador y ve a **https://localhost**

> El navegador mostrará un aviso de seguridad porque el certificado SSL es autofirmado (solo para desarrollo). Haz clic en "Avanzado" → "Continuar de todos modos" para acceder.

---

## Credenciales de demo

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@carzone.com | Carzone1234. |
| Empleado | empleado@carzone.com | Carzone1234. |
| Cliente | cliente@carzone.com | Carzone1234. |

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
    └──► [Laravel / Apache] → API REST
              │
              ▼
          [MySQL 8]         → Base de datos
```

El proxy Nginx recibe todas las peticiones. Las que van a `/api/` las reenvía al backend de Laravel. El resto las sirve el frontend de Angular.

---

## Tests

El proyecto incluye una suite de tests automatizados con **pytest** que cubren autenticación, catálogo, citas y financiaciones.

Con Docker levantado, desde la carpeta `tests/`:

```bash
pip install -r requirements.txt
pytest
```

Al terminar se genera un `informe.html` con el resultado visual de todos los tests.

---

## Comandos útiles

```bash
# Levantar en segundo plano
docker compose up --build -d

# Ver los logs en tiempo real
docker compose logs -f

# Parar los contenedores (conserva los datos de la BD)
docker compose down

# Parar y borrar también los datos de la BD (reinicio completo)
docker compose down -v
```

> Usa `docker compose down -v` si quieres que la base de datos se inicialice desde cero la próxima vez que levantes el proyecto.

---

## Notas

- La base de datos se inicializa automáticamente la primera vez. No es necesario ejecutar ningún comando de migrations ni seeders.
- Los certificados SSL se generan automáticamente al arrancar si no existen.
- Las imágenes de los vehículos están incluidas en el repositorio dentro de `carzone-api/storage/app/public/`.
- Si al entrar después de reiniciar Docker aparece un error de sesión, cierra sesión y vuelve a entrar — es el comportamiento normal al reiniciar la base de datos.