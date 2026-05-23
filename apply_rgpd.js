const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Inject the script tag
if (!html.includes('rgpd-cnil.js')) {
    html = html.replace('</body>', '    <script src="js/rgpd-cnil.js"></script>\n</body>');
}

// Add the RGPD UI and Privacy Policy Modal
const rgpdUI = `
    <!-- RGPD CONSENT BANNER -->
    <div id="rgpd-banner" class="hidden fullscreen-overlay" style="background: rgba(0,0,0,0.95); backdrop-filter: blur(20px); color: #fff; z-index: 90000; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;">
        <i class="fa-solid fa-shield-halved" style="font-size: 4rem; color: #00ffcc; margin-bottom: 20px;"></i>
        <h2 style="margin: 0 0 10px 0; text-transform: uppercase;">Vos Données, Vos Règles</h2>
        <p style="text-align: center; max-width: 400px; color: #ccc; margin-bottom: 30px;">Pour fonctionner (GPS, IA Vocale, Réalité Augmentée), l'application a besoin d'accéder aux capteurs de votre téléphone. <strong>Aucune donnée n'est envoyée sur des serveurs distants. Tout est traité localement (Privacy-by-Design).</strong></p>
        
        <div style="background: #111; padding: 20px; border-radius: 10px; width: 100%; max-width: 400px; margin-bottom: 20px;">
            <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 15px;">
                <span><i class="fa-solid fa-location-dot" style="color: #00b3ff; margin-right: 10px;"></i> GPS & Navigation</span>
                <input type="checkbox" id="rgpd-gps" checked disabled style="accent-color: #00b3ff; transform: scale(1.5);">
            </label>
            <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 15px;">
                <span><i class="fa-solid fa-microphone" style="color: #ff0055; margin-right: 10px;"></i> Micro (IA J.A.R.V.I.S)</span>
                <input type="checkbox" id="rgpd-mic" checked style="accent-color: #00ffcc; transform: scale(1.5);">
            </label>
            <label style="display: flex; justify-content: space-between; align-items: center;">
                <span><i class="fa-solid fa-camera" style="color: #b700ff; margin-right: 10px;"></i> Caméra (AR Vision)</span>
                <input type="checkbox" id="rgpd-cam" checked style="accent-color: #00ffcc; transform: scale(1.5);">
            </label>
        </div>
        
        <button onclick="window.acceptRGPD()" style="width: 100%; max-width: 400px; padding: 15px; background: #00ffcc; color: #000; font-weight: 900; font-size: 1.2rem; border: none; border-radius: 10px; cursor: pointer; text-transform: uppercase;">J'ACCEPTE</button>
        <button onclick="window.openPrivacyPolicy()" style="margin-top: 20px; background: none; border: none; color: #888; text-decoration: underline; cursor: pointer;">Lire la Politique de Confidentialité (CNIL)</button>
    </div>

    <!-- PRIVACY POLICY MODAL -->
    <div id="privacy-policy-modal" class="hidden fullscreen-overlay" style="background: #111; color: #fff; z-index: 95000; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; overflow-y: auto; padding: 30px; box-sizing: border-box;">
        <button onclick="window.closePrivacyPolicy()" style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer;"><i class="fa-solid fa-times"></i></button>
        <h2>Politique de Confidentialité & Mentions Légales</h2>
        <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et aux directives de la CNIL, voici la politique de traitement des données de notre application.</p>
        <h3>1. Privacy by Design (Traitement Local)</h3>
        <p>Cette application ne possède aucune base de données distante (backend). L'intégralité du traitement de votre position GPS, de votre voix (IA), et de la caméra (Réalité Augmentée) est effectuée en local, directement sur le processeur de votre téléphone. Aucune donnée ne quitte votre appareil.</p>
        <h3>2. Certificats CEE et Éco-Conduite</h3>
        <p>Les données d'accélération utilisées pour calculer le Score Éco et générer les Certificats d'Économie d'Énergie (CEE) sont anonymisées et stockées exclusivement dans le stockage local du navigateur (LocalStorage).</p>
        <h3>3. Droit à l'oubli (Article 17)</h3>
        <p>Vous avez le droit d'effacer toutes vos données à tout moment. Un bouton "Effacer mes données" est disponible dans le menu Profil de l'application. Cette action est irréversible.</p>
    </div>
`;

if (!html.includes('id="rgpd-banner"')) {
    html = html.replace('<!-- BIOMETRIC SYNC -->', rgpdUI + '\n    <!-- BIOMETRIC SYNC -->');
}

// Add the "Revoke" button to the Profile Screen
if (html.includes('id="user-profile"')) {
    const revokeBtn = `
        <button onclick="window.revokeAndEraseData()" style="width: 100%; padding: 15px; margin-top: 30px; background: transparent; border: 2px solid #ff0055; border-radius: 10px; color: #ff0055; font-weight: bold; font-size: 1rem; cursor: pointer; text-transform: uppercase;">
            <i class="fa-solid fa-trash-can"></i> Supprimer mes données (RGPD)
        </button>
    `;
    if (!html.includes('Supprimer mes données (RGPD)')) {
        html = html.replace('<p style="color: #aaa; text-align: center; margin-top: 20px;">Synchronisation Active - ID: GHOST-8492</p>', revokeBtn + '\n<p style="color: #aaa; text-align: center; margin-top: 20px;">Synchronisation Active - ID: GHOST-8492</p>');
    }
}

fs.writeFileSync('index.html', html);
console.log('RGPD UI and Script injected successfully.');
