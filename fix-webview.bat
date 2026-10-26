@echo off
title Webview & Service Worker Cache Fixer
color 0A
echo ======================================================================
echo           Antigravity IDE - Webview Service Worker Fixer
echo ======================================================================
echo.
echo Closing Antigravity IDE to release file locks...
taskkill /F /IM "Antigravity IDE.exe" >nul 2>&1
timeout /t 2 /nobreak >nul

echo Cleaning corrupted Service Worker and Webview cache folders...
rmdir /S /Q "%APPDATA%\Antigravity IDE\Service Worker" >nul 2>&1
rmdir /S /Q "%APPDATA%\Antigravity\Service Worker" >nul 2>&1
rmdir /S /Q "%APPDATA%\Antigravity IDE\Cache" >nul 2>&1
rmdir /S /Q "%APPDATA%\Antigravity IDE\Code Cache" >nul 2>&1
rmdir /S /Q "%APPDATA%\Antigravity IDE\GPUCache" >nul 2>&1
rmdir /S /Q "%APPDATA%\Antigravity IDE\DawnGraphiteCache" >nul 2>&1
rmdir /S /Q "%APPDATA%\Antigravity IDE\DawnWebGPUCache" >nul 2>&1

echo.
echo [SUCCESS] Corrupted cache folders removed successfully!
echo.
echo Restarting Antigravity IDE...
start "" "%LOCALAPPDATA%\Programs\Antigravity IDE\Antigravity IDE.exe" "d:\Project\Shikhar360"
echo Done!
timeout /t 3 >nul
