# Desarrollo local — Chorrillos Seguro

Este archivo contiene instrucciones paso a paso para levantar el entorno de desarrollo en Windows (PowerShell).

Requisitos (recomendado)
- Node.js 18+ y npm
- Git
- Docker Desktop (opcional pero recomendado para Postgres)

Archivos útiles
- `docker-compose.yml` — servicio Postgres para desarrollo
- `backend/.env.example` — variables de entorno de backend

1) Usando Docker (recomendado)

- Levantar Postgres con Docker Compose:

```powershell
cd C:\Users\Usuario\Desktop\CHORRILLOS-SEGURO
docker compose up -d
```

- (Opcional) Verificar contenedor:
```powershell
docker ps
```

- Copiar `.env.example` a `.env` dentro de `backend` (si no está hecho):
```powershell
cd backend
copy .env.example .env
```

- Ejecutar migraciones:
```powershell
npm install
npm run migrate
```

- Iniciar backend:
```powershell
npm start
# o para desarrollo con reinicios automáticos
npm run start:dev
```

- Iniciar frontend (en una terminal separada):
```powershell
cd ..\frontend
npm install
npm start
```

2) Sin Docker (Postgres local)

- Ajusta `backend\.env` o la variable de entorno `DATABASE_URL` con tus credenciales.
- Ejecuta migraciones y arranca servicios como arriba.

3) Notas y troubleshooting
- Si `npm run migrate` falla con `ECONNREFUSED`, la DB no está accesible.
- Si no tienes `docker`/`docker compose` disponible instala Docker Desktop.
- `backend/uploads` es la carpeta donde se guardan archivos subidos. Asegúrate de que exista o se creará automáticamente al iniciar el backend.

4) Endpoints útiles
- POST /api/cameras/register — registrar cámara (form-data con campo `imagenReferencial`)
- GET /api/cameras — lista
- GET /api/cameras/:id — detalle
- DELETE /api/cameras/:id — borrar
- POST /api/vigilantes/register — registrar vigilante (form-data `foto`, `documentos`)
- GET /api/vigilantes — lista
- GET /api/vigilantes/:id — detalle
- DELETE /api/vigilantes/:id — borrar

## Windows helper: install_local_postgres.ps1

A convenience PowerShell script `install_local_postgres.ps1` was added to automate a common Windows development flow:

- Installs PostgreSQL via `winget` if `psql` is not available.
- Waits for the database to accept connections.
- Creates the application database and user (`pguser` / `pgpass`).
- Updates `backend/.env` with the local connection string.
- Runs `npm install` and `npm run migrate` in the `backend` folder.
- Starts the backend and frontend each in new PowerShell windows.

Usage (PowerShell - run as Administrator if installing PostgreSQL):

```powershell
cd C:\Users\Usuario\Desktop\CHORRILLOS-SEGURO
.\install_local_postgres.ps1
```

Notes:
- The script uses `winget` to install PostgreSQL when needed; if `winget` isn't available, install PostgreSQL manually and then run the migration steps.
- If you prefer Docker, use the included `docker-compose.yml` instead (recommended for parity with other environments).

Si quieres, puedo:
- Añadir un `Makefile` o `scripts.ps1` para automatizar (start-all, stop-all, migrate)
- Añadir tests y CI básico
- Integrar las vistas de lista en el `PanelAdmin`

Elige el siguiente paso y lo implemento.
