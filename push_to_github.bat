@echo off
setlocal
echo =======================================================
echo 🚀 NexaBus / BusTicketing GitHub Sync
echo =======================================================
echo.

set "PATH=%LOCALAPPDATA%\MinGit\cmd;%LOCALAPPDATA%\GitHubCLI\bin;%PATH%"

echo 1. Checking GitHub Login...
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo 🔑 Please sign in to GitHub via your browser...
    gh auth login --web -h github.com -p https -w
    gh auth setup-git
)

echo.
echo 2. Pushing code to https://github.com/NeitikSupolia/BusTicketing.git...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo =======================================================
    echo ✅ SUCCESS! Code pushed to GitHub:
    echo 🔗 https://github.com/NeitikSupolia/BusTicketing
    echo =======================================================
) else (
    echo.
    echo ⚠️ Push failed. Please check your GitHub permissions or try again.
)

pause
