const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Inject the script tag
if (!html.includes('carbon-trading.js')) {
    html = html.replace('</body>', '    <script src="js/carbon-trading.js"></script>\n</body>');
}

// Update Wallet HTML to include the Carbon Trading button
if (html.includes('id="crypto-wallet"')) {
    const tradeBtn = `
        <button onclick="window.openTradingFloor()" style="width: 100%; padding: 15px; margin-top: 20px; background: linear-gradient(45deg, #00ffcc, #00b3ff); border: none; border-radius: 10px; color: #000; font-weight: 900; font-size: 1.1rem; cursor: pointer; text-transform: uppercase;">
            <i class="fa-solid fa-leaf"></i> Marché du Carbone (CEE)
        </button>
    `;
    if (!html.includes('Marché du Carbone (CEE)')) {
        html = html.replace('<p style="color: #aaa; text-align: center; margin-top: 20px;">Portefeuille chiffré - 256bit</p>', tradeBtn + '\n<p style="color: #aaa; text-align: center; margin-top: 20px;">Portefeuille chiffré - 256bit</p>');
    }
}

// Inject CEE Certificate and Trading Floor screens
const ceeUI = `
    <!-- CEE CERTIFICATE SCREEN -->
    <div id="cee-certificate-screen" class="hidden fullscreen-overlay" style="background: rgba(0,25,0,0.9); backdrop-filter: blur(15px); color: #fff; z-index: 50000; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="border: 5px double #00ffcc; padding: 40px; border-radius: 10px; background: rgba(0,50,20,0.8); max-width: 90%; text-align: center; box-shadow: 0 0 50px rgba(0,255,200,0.3);">
            <i class="fa-solid fa-award" style="font-size: 5rem; color: #00ffcc; margin-bottom: 20px;"></i>
            <h2 style="margin:0; font-family: 'Times New Roman', serif; color: #fff; font-size: 2rem; text-transform: uppercase;">Certificat Officiel</h2>
            <h3 style="margin: 5px 0 20px 0; color: #00ffcc; font-weight: 300;">Économie d'Énergie (CEE)</h3>
            
            <div style="text-align: left; border-top: 1px solid #555; padding-top: 20px;">
                <p style="color: #aaa; margin: 5px 0;">TITULAIRE : <strong style="color:#fff;">Pilote de 50cc</strong></p>
                <p style="color: #aaa; margin: 5px 0;">ECO-SCORE : <strong id="cee-score" style="color:#00ffcc; font-size: 1.5rem;">100/100</strong></p>
                <p style="color: #aaa; margin: 5px 0;">SÉRIE UNIQUE : <span id="cee-serial" style="font-family: monospace; color: #fff;">--</span></p>
            </div>
            
            <p style="font-size: 0.9rem; color: #888; margin-top: 20px; font-style: italic;">Ce document certifie la non-émission de gaz à effet de serre comparativement à un véhicule lourd.</p>
            
            <button onclick="window.closeCEE()" style="margin-top: 30px; padding: 15px 40px; background: #00ffcc; color: #000; font-weight: bold; border: none; border-radius: 50px; cursor: pointer;">ENCAISSER LE CERTIFICAT</button>
        </div>
    </div>

    <!-- CARBON TRADING FLOOR -->
    <div id="carbon-trading-floor" class="hidden fullscreen-overlay" style="background: #111; color: #fff; z-index: 55000; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; flex-direction: column; padding: 30px; box-sizing: border-box;">
        <button onclick="window.closeTradingFloor()" style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer;"><i class="fa-solid fa-times"></i></button>
        
        <h2 style="margin: 0 0 5px 0; color: #fff; text-transform: uppercase;">Salle de Marché</h2>
        <p style="color: #00ffcc; margin: 0 0 30px 0;">Revente de Crédits Carbone</p>
        
        <div style="background: #000; border: 1px solid #333; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 20px;">
            <p style="color: #888; text-transform: uppercase; margin: 0 0 10px 0;">Cours Actuel du CEE (Mégacorporations)</p>
            <div id="carbon-stock-price" style="font-size: 4rem; font-family: monospace; font-weight: 900; color: #00ff00;">-- €</div>
        </div>
        
        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; text-align: center;">
            <h3 style="margin: 0 0 10px 0;">Votre Inventaire</h3>
            <div id="cee-inventory" style="font-size: 2rem; color: #00ffcc; font-weight: bold;">0 CEE Disponibles</div>
            <p style="color: #aaa; font-size: 0.9rem;">Prêts à être revendus aux industries pour compenser leurs émissions.</p>
        </div>
        
        <button id="sell-cee-btn" onclick="window.sellCEE()" style="margin-top: auto; padding: 20px; background: linear-gradient(90deg, #ff0055, #b700ff); border: none; border-radius: 10px; color: #fff; font-weight: 900; font-size: 1.2rem; cursor: pointer; text-transform: uppercase; box-shadow: 0 10px 20px rgba(255,0,85,0.3);">
            VENDRE AUX POLLUEURS
        </button>
    </div>
`;

if (!html.includes('id="carbon-trading-floor"')) {
    html = html.replace('<!-- BIOMETRIC SYNC -->', ceeUI + '\n    <!-- BIOMETRIC SYNC -->');
}

fs.writeFileSync('index.html', html);
console.log('Carbon Trading UI and Script injected successfully.');
