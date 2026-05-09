@echo off
set JAVA_HOME=C:\Users\xavie\.bubblewrap\jdk\jdk-17.0.11+9
set ANDROID_HOME=C:\Users\xavie\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%PATH%
set GRADLE_OPTS=-Xmx384m -XX:MaxMetaspaceSize=128m

echo [INFO] Nettoyage et Compilation v50.0.17...
call gradlew clean bundleRelease --no-daemon

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Build completed.
    copy android\app\build\outputs\bundle\release\app-release.aab mon50ccetmoi_v50.0.17_ULTIMATE_LATEST.aab
    echo [INFO] Nouveau bundle cree : mon50ccetmoi_v50.0.17_ULTIMATE_LATEST.aab
) else (
    echo [ERROR] Build failed.
    exit /b %ERRORLEVEL%
)
