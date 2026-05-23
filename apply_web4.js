const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Inject the script tag
if (!html.includes('web4-recovery.js')) {
    html = html.replace('</body>', '    <script src="js/web4-recovery.js"></script>\n</body>');
}

// Add the Backup and Restore buttons to the Wallet
if (html.includes('id="crypto-wallet-screen"')) {
    const backupBtns = `
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button onclick="window.generateRecoveryKey()" style="flex: 1; padding: 10px; background: rgba(0,255,204,0.1); border: 1px solid #00ffcc; border-radius: 5px; color: #00ffcc; cursor: pointer; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-key"></i> Sauvegarder</button>
            <button onclick="window.openRestoreModal()" style="flex: 1; padding: 10px; background: rgba(255,0,85,0.1); border: 1px solid #ff0055; border-radius: 5px; color: #ff0055; cursor: pointer; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-download"></i> Restaurer</button>
        </div>
    `;
    if (!html.includes('Sauvegarder')) {
        // Insert right after the balance display
        html = html.replace('</div>\n        \n        <button onclick="window.openTradingFloor()"', '</div>\n        ' + backupBtns + '\n        <button onclick="window.openTradingFloor()"');
    }
}

// Add the UI modals for Web4 Recovery
const web4UI = `
    <!-- WEB4 BACKUP MODAL -->
    <div id="web4-backup-modal" class="hidden fullscreen-overlay" style="background: rgba(0,0,0,0.9); z-index: 60000; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
        <div style="background: #111; border: 2px solid #00ffcc; border-radius: 10px; padding: 30px; text-align: center; max-width: 400px;">
            <h3 style="color: #00ffcc; margin-top: 0;">Clé de Sauvegarde</h3>
            <p style="color: #ccc; font-size: 0.9rem; margin-bottom: 20px;">Copiez cette clé en lieu sûr. Si vous perdez cette clé, vos fonds seront perdus à jamais.</p>
            <div id="web4-key-display" style="background: #000; padding: 15px; border-radius: 5px; font-family: monospace; color: #fff; font-size: 1.2rem; word-break: break-all; margin-bottom: 20px;">--</div>
            <button onclick="window.closeBackupModal()" style="padding: 10px 30px; background: #00ffcc; color: #000; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">J'AI NOTÉ MA CLÉ</button>
        </div>
    </div>

    <!-- WEB4 RESTORE MODAL -->
    <div id="web4-restore-modal" class="hidden fullscreen-overlay" style="background: rgba(0,0,0,0.9); z-index: 60000; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
        <div style="background: #111; border: 2px solid #ff0055; border-radius: 10px; padding: 30px; text-align: center; max-width: 400px; width: 100%;">
            <h3 style="color: #ff0055; margin-top: 0;">Restaurer un Compte</h3>
            <p style="color: #ccc; font-size: 0.9rem; margin-bottom: 20px;">Collez votre clé secrète GHOST pour récupérer votre solde et vos CEE.</p>
            <input type="text" id="web4-restore-input" placeholder="GHOST-..." style="width: 100%; padding: 15px; background: #000; border: 1px solid #333; color: #00ffcc; font-family: monospace; margin-bottom: 20px; box-sizing: border-box;">
            <div style="display: flex; gap: 10px;">
                <button onclick="window.closeRestoreModal()" style="flex: 1; padding: 10px; background: #333; color: #fff; border: none; border-radius: 5px; cursor: pointer;">ANNULER</button>
                <button onclick="window.restoreAccount()" style="flex: 1; padding: 10px; background: #ff0055; color: #fff; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">RESTAURER</button>
            </div>
        </div>
    </div>
`;

if (!html.includes('id="web4-backup-modal"')) {
    html = html.replace('<!-- BIOMETRIC SYNC -->', web4UI + '\n    <!-- BIOMETRIC SYNC -->');
}

fs.writeFileSync('index.html', html);
console.log('Web4 UI and Script injected successfully.');
