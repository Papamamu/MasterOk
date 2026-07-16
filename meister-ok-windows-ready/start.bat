@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"
title Meister OK - Start

echo ========================================
echo        MEISTER OK - WINDOWS START
echo ========================================
echo.

where docker >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Docker is not installed or not available in PATH.
  echo Install Docker Desktop from https://www.docker.com/products/docker-desktop/
  echo Restart Windows after installation and run start.bat again.
  pause
  exit /b 1
)

docker info >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Docker Desktop is not running.
  echo Start Docker Desktop, wait until it is ready, then run start.bat again.
  pause
  exit /b 1
)

docker compose version >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Docker Compose v2 is unavailable. Update Docker Desktop.
  pause
  exit /b 1
)

if not exist ".env" (
  echo Creating first-run settings...
  for /f "usebackq delims=" %%S in (`powershell -NoProfile -Command "$b=New-Object byte[] 48; [Security.Cryptography.RandomNumberGenerator]::Fill($b); [Convert]::ToBase64String($b)"`) do set "AUTH_SECRET=%%S"
  for /f "usebackq delims=" %%P in (`powershell -NoProfile -Command "-join ((48..57)+(65..90)+(97..122) | Get-Random -Count 18 | ForEach-Object {[char]$_})"`) do set "ADMIN_PASSWORD=%%P"
  >.env echo AUTH_SECRET=!AUTH_SECRET!
  >>.env echo ADMIN_EMAIL=admin@meister-ok.local
  >>.env echo ADMIN_PASSWORD=!ADMIN_PASSWORD!
  >>.env echo APP_PORT=3000
  >>.env echo BACKUP_INTERVAL_HOURS=24
  >>.env echo BACKUP_RETENTION_DAYS=14
  echo.
  echo First administrator created:
  echo Email: admin@meister-ok.local
  echo Password: !ADMIN_PASSWORD!
  echo.
  echo Save this password now. It is also stored in the local .env file.
  echo.
)

echo Building and starting the website...
docker compose up -d --build
if errorlevel 1 (
  echo.
  echo [ERROR] The containers failed to start.
  echo Run: docker compose logs app
  pause
  exit /b 1
)

set "SITE_PORT=3000"
for /f "tokens=2 delims==" %%A in ('findstr /B /C:"APP_PORT=" .env 2^>nul') do set "SITE_PORT=%%A"

echo Waiting for the website...
powershell -NoProfile -Command "$ok=$false; 1..60 | ForEach-Object { try { $r=Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 http://127.0.0.1:!SITE_PORT!/api/health; if($r.StatusCode -eq 200){$ok=$true; break} } catch {}; Start-Sleep -Seconds 2 }; if(-not $ok){exit 1}"
if errorlevel 1 (
  echo.
  echo [ERROR] The website did not become ready in time.
  echo Check logs with: docker compose logs app
  pause
  exit /b 1
)

echo.
echo Website: http://localhost:!SITE_PORT!
echo Admin panel: http://localhost:!SITE_PORT!/admin
echo Data and photos are stored in persistent Docker volumes.
echo.
start "" "http://localhost:!SITE_PORT!"
pause
exit /b 0
