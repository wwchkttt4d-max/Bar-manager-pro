@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════╗
echo ║   GAMMA — Mise à jour des fichiers   ║
echo ╚══════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/3] Récupération des fichiers...
git fetch origin
if %errorlevel% neq 0 (
  echo ERREUR: git fetch a échoué. Vérifiez votre connexion internet.
  pause
  exit /b 1
)

echo [2/3] Mise à jour de index.html...
git checkout origin/claude/gamma-stock-management-foXnE -- index.html
if %errorlevel% neq 0 (
  echo ERREUR: impossible de récupérer index.html
  pause
  exit /b 1
)

echo [3/3] Mise à jour de app.js...
git checkout origin/claude/gamma-stock-management-foXnE -- app.js
if %errorlevel% neq 0 (
  echo ERREUR: impossible de récupérer app.js
  pause
  exit /b 1
)

echo.
echo ✓ Mise à jour terminée avec succès !
echo.
echo Maintenant dans Chrome: appuyez sur Ctrl+Shift+R pour recharger l'application.
echo.
pause
