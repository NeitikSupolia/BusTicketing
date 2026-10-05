@echo off
setlocal
echo =======================================================
echo 🔥 MyJourney Firebase Hosting Deployment
echo Project ID: apps-cafd4
echo =======================================================
echo.

echo 1. Checking Firebase Login...
call npx firebase-tools login:list >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔑 Logging in to Firebase in your browser...
    call npx firebase-tools login
)

echo.
echo 2. Deploying MyJourney to Firebase Hosting...
call npx firebase-tools deploy --only hosting --project apps-cafd4

if %errorlevel% equ 0 (
    echo.
    echo =======================================================
    echo 🎉 SUCCESS! Your website is live on Firebase Hosting:
    echo 🔗 https://apps-cafd4.web.app
    echo 🔗 https://apps-cafd4.firebaseapp.com
    echo =======================================================
) else (
    echo.
    echo ⚠️ Deployment encountered an issue. Please verify you are logged in to the correct Google account.
)

pause
