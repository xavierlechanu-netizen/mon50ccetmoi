@echo off
REM ═══════════════════════════════════════════════════════════════
REM  DEPLOY REVOLUT FUNCTIONS — mon50ccetmoi
REM  Déploie les Firebase Cloud Functions + règles Firestore
REM ═══════════════════════════════════════════════════════════════

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║   mon50ccetmoi — Déploiement Revolut Functions       ║
echo  ║   Revolut Merchant API v2026-04-20                   ║
echo  ╚══════════════════════════════════════════════════════╝
echo.

REM Vérifier que firebase CLI est installé
where firebase >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] Firebase CLI non trouvé. Installez-le :
    echo   npm install -g firebase-tools
    echo   firebase login
    pause
    exit /b 1
)

REM ── Étape 1 : Installer les dépendances des Functions ────────
echo [1/4] Installation des dépendances npm...
cd functions
call npm install
cd ..
echo       OK
echo.

REM ── Étape 2 : Configurer la clé secrète Revolut ──────────────
echo [2/4] Configuration de la clé secrète Revolut...
echo.
echo  ⚠️  Vous allez être invité à saisir votre clé SECRÈTE Revolut (sk_...).
echo      Elle sera stockée dans Firebase Secret Manager (chiffrée).
echo      Elle ne sera JAMAIS dans le code source.
echo.
firebase functions:secrets:set REVOLUT_SECRET_KEY
if %ERRORLEVEL% neq 0 (
    echo [AVERTISSEMENT] Secret déjà configuré ou erreur. Continuer...
)
echo       OK
echo.

REM ── Étape 3 : Déployer les Functions + Firestore rules ───────
echo [3/4] Déploiement des Cloud Functions et règles Firestore...
firebase deploy --only functions,firestore:rules
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] Échec du déploiement Firebase.
    pause
    exit /b 1
)
echo       OK
echo.

REM ── Étape 4 : Afficher les URLs des Functions ─────────────────
echo [4/4] URLs des Cloud Functions déployées :
echo.
firebase functions:list
echo.

echo  ╔══════════════════════════════════════════════════════╗
echo  ║   ✅ Déploiement terminé avec succès !               ║
echo  ╠══════════════════════════════════════════════════════╣
echo  ║                                                      ║
echo  ║  PROCHAINE ÉTAPE — Configurer le Webhook Revolut :   ║
echo  ║                                                      ║
echo  ║  1. Dashboard Revolut Business                       ║
echo  ║  2. APIs ^& Webhooks ^> Webhooks                       ║
echo  ║  3. Ajouter l'URL :                                  ║
echo  ║     https://europe-west1-mon50ccetmoi                ║
echo  ║     .cloudfunctions.net/revolutWebhook               ║
echo  ║  4. Événements : ORDER_COMPLETED                     ║
echo  ║                  ORDER_PAYMENT_DECLINED              ║
echo  ║                                                      ║
echo  ╚══════════════════════════════════════════════════════╝
echo.
pause
