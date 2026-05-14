@echo off
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
echo [INFO] Publication du bundle v52020...
cmd /c bubblewrap play publish --aabPath C:\Users\xavie\.gemini\antigravity\scratch\balade-app\app\build\outputs\bundle\release\app-release.aab
