@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Meister OK - Stop

where docker >nul 2>nul
if errorlevel 1 (
  echo Docker is not installed or unavailable.
  pause
  exit /b 1
)

echo Stopping Meister OK...
docker compose down
if errorlevel 1 (
  echo Failed to stop the containers. Make sure Docker Desktop is running.
  pause
  exit /b 1
)

echo.
echo Website stopped successfully.
echo The database, photos and backups were preserved.
echo Run start.bat to start it again.
pause
