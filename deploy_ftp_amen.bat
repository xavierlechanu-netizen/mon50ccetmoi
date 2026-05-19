@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════════╗
echo ║   DEPLOY FTP → mon50ccetmoi.com (Amen)          ║
echo ║   mon 50cc et moi  v60.0.17-GOLD                ║
echo ╚══════════════════════════════════════════════════╝
echo.

REM ┌─────────────────────────────────────────┐
REM │  CONFIGURATION FTP AMEN                 │
REM │  Remplissez vos identifiants Amen ici   │
REM └─────────────────────────────────────────┘
set FTP_HOST=mon50ccetmoi.com
set FTP_USER=VOTRE_LOGIN_AMEN
set FTP_PASS=VOTRE_MOT_DE_PASSE_AMEN
set FTP_REMOTE_DIR=/public/www
set LOCAL_DIR=%~dp0

echo [1/4] WinSCP detecte : C:\Program Files (x86)\WinSCP\WinSCP.com
set WINSCP="C:\Program Files (x86)\WinSCP\WinSCP.com"

echo [2/4] Connexion FTP via WinSCP...
goto :FTP_WINSCP

REM ════════════════════════════════════════════
REM  METHODE 1 : WinSCP (recommande, avec FTPS)
REM ════════════════════════════════════════════
:FTP_WINSCP
echo [INFO] Deploiement via WinSCP (FTPS securise)...

REM Creer le script WinSCP temporaire
set SCRIPT_FILE=%TEMP%\winscp_deploy_mon50cc.txt

(
echo open ftp://%FTP_USER%:%FTP_PASS%@%FTP_HOST%/
echo option transfer binary
echo option confirm off
echo synchronize remote "%LOCAL_DIR%" "%FTP_REMOTE_DIR%" -filemask="*.html|*.js|*.css|*.json|*.xml|*.png|*.jpg|*.svg|*.ico|*.txt|*.webp|*.webmanifest"
echo exit
) > "%SCRIPT_FILE%"

%WINSCP% /script="%SCRIPT_FILE%" /log="%TEMP%\winscp_deploy.log"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ [SUCCESS] Deploiement WinSCP termine !
    del "%SCRIPT_FILE%" >nul 2>&1
    goto :VERIFY
) else (
    echo [WARN] WinSCP a echoue. Basculement vers FTP natif...
    del "%SCRIPT_FILE%" >nul 2>&1
    goto :FTP_NATIVE
)

REM ════════════════════════════════════════════
REM  METHODE 2 : FTP Natif Windows (fallback)
REM ════════════════════════════════════════════
:FTP_NATIVE
echo [2/4] Connexion FTP natif Windows...

set FTP_SCRIPT=%TEMP%\ftp_mon50cc.txt

(
echo open %FTP_HOST%
echo user %FTP_USER% %FTP_PASS%
echo binary
echo prompt off
echo cd %FTP_REMOTE_DIR%
echo lcd "%LOCAL_DIR%"
echo mput index.html
echo mput manifest.json
echo mput sw.js
echo mput robots.txt
echo mput sitemap.xml
echo mput login.html
echo mput privacy.html
echo mput banned.html
echo mput admin.html
echo lcd "%LOCAL_DIR%js"
echo cd %FTP_REMOTE_DIR%/js
echo mput *.js
echo lcd "%LOCAL_DIR%css"
echo cd %FTP_REMOTE_DIR%/css
echo mput *.css
echo lcd "%LOCAL_DIR%.well-known"
echo cd %FTP_REMOTE_DIR%/.well-known
echo mput assetlinks.json
echo bye
) > "%FTP_SCRIPT%"

ftp -s:"%FTP_SCRIPT%"
set FTP_RESULT=%ERRORLEVEL%
del "%FTP_SCRIPT%" >nul 2>&1

if %FTP_RESULT% EQU 0 (
    echo ✅ [SUCCESS] Deploiement FTP natif termine !
) else (
    echo ❌ [ERROR] Echec du deploiement FTP.
    echo.
    echo    Verifiez vos identifiants dans ce script :
    echo    FTP_HOST  = %FTP_HOST%
    echo    FTP_USER  = %FTP_USER%
    echo    FTP_PASS  = [masque]
    echo.
    echo    Ou connectez-vous manuellement sur :
    echo    https://espace-client.amen.fr
    pause
    exit /b 1
)

REM ════════════════════════════════════════════
REM  VERIFICATION POST-DEPLOY
REM ════════════════════════════════════════════
:VERIFY
echo.
echo [3/4] Verification du deploiement...
echo.

REM Test si le site repond
curl -s -o nul -w "HTTP Status: %%{http_code}" https://mon50ccetmoi.com/ 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Site accessible sur https://mon50ccetmoi.com/
) else (
    echo [INFO] Le site peut mettre quelques minutes a repondre (propagation DNS)
)

REM Test assetlinks
curl -s -o nul -w "AssetLinks: %%{http_code}" https://mon50ccetmoi.com/.well-known/assetlinks.json 2>nul

echo.
echo [4/4] Resume du deploiement
echo ─────────────────────────────────────────────────────
echo   🌐 Site web    : https://mon50ccetmoi.com/
echo   🔒 AssetLinks  : https://mon50ccetmoi.com/.well-known/assetlinks.json
echo   📧 Contact     : contact@mon50ccetmoi.com
echo   📦 Version     : v60.0.17-GOLD
echo   📅 Date        : %DATE% %TIME%
echo ─────────────────────────────────────────────────────
echo.
echo ATTENTION : Pour que la TWA Android fonctionne,
echo verifie que assetlinks.json est accessible en HTTPS !
echo.
pause
