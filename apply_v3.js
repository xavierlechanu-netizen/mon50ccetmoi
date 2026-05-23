const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Inject the script tag
if (!html.includes('v3-smartcity.js')) {
    html = html.replace('</body>', '    <script src="js/v3-smartcity.js"></script>\n</body>');
}

// Inject the Zero-Click Screen and V2X HUD
const v3UI = `
    <!-- ZERO-CLICK DESTINY OVERLAY -->
    <div id="zero-click-screen" class="hidden fullscreen-overlay" style="background: rgba(0,0,0,0.9); backdrop-filter: blur(10px); color: #fff; z-index: 40000; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <i class="fa-solid fa-wand-magic-sparkles fa-bounce" style="font-size: 4rem; color: #b700ff; margin-bottom: 20px;"></i>
        <h2 style="font-size: 1.5rem; color: #aaa; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Itinéraire Prédictif</h2>
        <div id="zero-click-destination" style="font-size: 3rem; font-weight: 900; color: #fff; text-shadow: 0 0 15px #b700ff; margin: 20px 0; text-align: center;">--</div>
        <p style="font-size: 1.2rem; margin: 10px 0;">Départ automatique dans :</p>
        <div id="zero-click-countdown" style="font-size: 6rem; font-weight: 900; color: #00ffcc;">3</div>
        <button onclick="window.cancelZeroClick()" style="margin-top: 40px; padding: 15px 40px; font-size: 1.2rem; font-weight: bold; background: transparent; color: #fff; border: 2px solid #555; border-radius: 40px; cursor: pointer;">ANNULER (Mode Manuel)</button>
    </div>

    <!-- V2X SMART CITY HUD (Green Wave) -->
    <div id="v2x-hud" class="hidden" style="position: fixed; top: 180px; left: 20px; z-index: 15000; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); border-left: 5px solid #00ffcc; border-radius: 0 15px 15px 0; padding: 15px 25px; box-shadow: 0 5px 20px rgba(0,0,0,0.5);">
        <div style="font-size: 0.8rem; color: #aaa; text-transform: uppercase; letter-spacing: 1px;">V2X Green Wave</div>
        <div id="v2x-status" style="font-size: 1.2rem; font-weight: 900; color: #00ffcc; margin: 5px 0;">SYNCHRONISATION...</div>
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-traffic-light" style="color: #fff;"></i>
            <span style="font-size: 0.9rem; color: #ddd;">Cible : <span id="v2x-target-speed" style="font-weight: bold;">-- km/h</span></span>
        </div>
    </div>
`;

if (!html.includes('id="zero-click-screen"')) {
    html = html.replace('<!-- BIOMETRIC SYNC -->', v3UI + '\n    <!-- BIOMETRIC SYNC -->');
}

fs.writeFileSync('index.html', html);
console.log('V3 UI and Script injected successfully.');
