@echo off
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
echo [INFO] Publication du bundle v50.0.24 (50041)...
bubblewrap play publish --aabPath C:\Users\xavie\.gemini\antigravity\scratch\balade-app\android\app\build\outputs\bundle\release\app-release.aab --verbose
