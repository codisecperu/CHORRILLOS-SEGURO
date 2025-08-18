<#
install_local_postgres.ps1
Clean helper script to install/configure Postgres and run migrations on Windows.
#>

param()

function Write-Info($m) { Write-Host "[info] $m" -ForegroundColor Cyan }
function Write-Err($m) { Write-Host "[error] $m" -ForegroundColor Red }
function Write-Succ($m) { Write-Host "[ok] $m" -ForegroundColor Green }

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$backendDir = Join-Path $repoRoot 'backend'
$frontendDir = Join-Path $repoRoot 'frontend'

Write-Info "Repo: $repoRoot"

# 1) Check psql
$psqlCmd = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlCmd) {
  Write-Info "psql not found in PATH. Attempting winget install..."
  $winget = Get-Command winget -ErrorAction SilentlyContinue
  if (-not $winget) { Write-Err "winget not available; install Postgres manually."; exit 1 }
  winget install --id PostgreSQL.PostgreSQL -e --silent
  if ($LASTEXITCODE -ne 0) { Write-Err "winget failed"; exit 1 }
  Start-Sleep -Seconds 3
  $env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')
  $psqlCmd = Get-Command psql -ErrorAction SilentlyContinue
  if (-not $psqlCmd) { Write-Err "psql still not found"; exit 1 }
}
Write-Succ "psql available: $($psqlCmd.Path)"

# 2) Wait for Postgres
Write-Info "Waiting for Postgres on localhost:5432..."
$tries = 20
for ($i=0; $i -lt $tries; $i++) {
  $t = Test-NetConnection -ComputerName 'localhost' -Port 5432 -WarningAction SilentlyContinue
  if ($t.TcpTestSucceeded) { break }
  Start-Sleep -Seconds 2
}
$t = Test-NetConnection -ComputerName 'localhost' -Port 5432 -WarningAction SilentlyContinue
if (-not $t.TcpTestSucceeded) { Write-Err "Postgres not responding on localhost:5432"; exit 1 }
Write-Succ "Postgres listening"

# 3) Create DB/user
$superPass = Read-Host "Enter 'postgres' superuser password (required)" -AsSecureString
$ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($superPass)
$postgresPass = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)

$appUser = 'pguser'
$appPass = 'pgpass'
$dbName = 'chor_db'

Write-Info "Creating role and database if missing..."
$createSql = "DO $$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$appUser') THEN CREATE ROLE $appUser LOGIN PASSWORD '$appPass'; END IF; IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '$dbName') THEN CREATE DATABASE $dbName OWNER $appUser; END IF; END $$;"
$psqlExe = (Get-Command psql).Source
& $psqlExe -U postgres -h localhost -p 5432 -c $createSql
if ($LASTEXITCODE -ne 0) { Write-Err "Failed to create role/DB with psql"; exit 1 }
Write-Succ "Role/DB created or already exist"

# 4) Update backend/.env
$envFile = Join-Path $backendDir '.env'
$databaseUrl = "postgresql://${appUser}:${appPass}@localhost:5432/${dbName}"
if (Test-Path $envFile) {
  (Get-Content $envFile) | ForEach-Object { if ($_ -match '^DATABASE_URL=') { "DATABASE_URL=$databaseUrl" } else { $_ } } | Set-Content $envFile -Encoding UTF8
  Write-Succ "Updated $envFile"
} else {
  "DATABASE_URL=$databaseUrl`nPORT=5000`nNODE_ENV=development" | Out-File -FilePath $envFile -Encoding UTF8
  Write-Succ "Created $envFile"
}

# 5) Run migrations
Write-Info "Installing backend deps and running migrations..."
Push-Location $backendDir
npm install --no-audit --no-fund
npm run migrate
if ($LASTEXITCODE -ne 0) { Write-Err "Migrations failed"; Pop-Location; exit 1 }
Pop-Location
Write-Succ "Migrations completed"

# 6) Start backend and frontend in new windows
Write-Info "Starting backend and frontend in new PowerShell windows..."
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$backendDir`"; npm run start:dev"
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$frontendDir`"; npm install; npm start"

Start-Process "http://localhost:3000"
Start-Process "http://localhost:5000/api"

Write-Succ "Done. Frontend: http://localhost:3000  Backend: http://localhost:5000/api"

# Cleanup
Remove-Variable postgresPass -ErrorAction SilentlyContinue
exit 0