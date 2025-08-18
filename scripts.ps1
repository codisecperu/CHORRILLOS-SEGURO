param(
  [string]$action = 'help'
)

function Help() {
  Write-Host "Usage: .\scripts.ps1 <action>"
  Write-Host "Actions: up, down, migrate, start-backend, start-frontend, start-all"
}

if ($action -eq 'up') {
  docker compose up -d
  return
}

if ($action -eq 'down') {
  docker compose down
  return
}

if ($action -eq 'migrate') {
  Push-Location backend
  npm install
  npm run migrate
  Pop-Location
  return
}

if ($action -eq 'start-backend') {
  Push-Location backend
  npm install
  npm run start:dev
  Pop-Location
  return
}

if ($action -eq 'start-frontend') {
  Push-Location frontend
  npm install
  npm start
  Pop-Location
  return
}

if ($action -eq 'start-all') {
  docker compose up -d
  Push-Location backend
  npm install
  npm run migrate
  Start-Process powershell -ArgumentList '-NoExit','-Command','cd frontend; npm install; npm start'
  npm run start:dev
  Pop-Location
  return
}

Help()
