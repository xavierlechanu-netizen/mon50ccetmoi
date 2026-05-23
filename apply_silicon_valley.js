const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Inject Video BG for AR
if (!html.includes('id="ar-video-bg"')) {
    html = html.replace('<div id="map"></div>', '<video id="ar-video-bg" class="hidden" autoplay playsinline style="position:fixed; top:0; left:0; width:100vw; height:100vh; object-fit:cover; z-index:-1;"></video>\n    <div id="map"></div>');
}

// 2. Inject Biometrics on HUD
const biometricUI = `
    <!-- BIOMETRIC SYNC -->
    <div id="biometric-hud" style="position:fixed; top:120px; left:20px; z-index:15000; background:rgba(0,0,0,0.6); backdrop-filter:blur(10px); border:1px solid #00ffcc; border-radius:30px; padding:10px 20px; display:flex; align-items:center; gap:15px; box-shadow:0 5px 15px rgba(0,0,0,0.5);">
        <i id="biometric-heart" class="fa-solid fa-heart-pulse fa-beat" style="color:#00ffcc; font-size:1.5rem;"></i>
        <span id="biometric-bpm" style="color:#00ffcc; font-weight:900; font-size:1.2rem; text-shadow:0 0 10px #00ffcc;">-- BPM</span>
    </div>
`;
if (!html.includes('id="biometric-hud"')) {
    html = html.replace('<!-- WEATHER OVERLAY (Fallback) -->', biometricUI + '\n    <!-- WEATHER OVERLAY (Fallback) -->');
}

// 3. Inject Crypto Wallet Screen
const cryptoWalletUI = `
<!-- CRYPTO WALLET SCREEN -->
<div id="crypto-wallet-screen" class="hidden fullscreen-overlay" style="background: linear-gradient(135deg, #0f172a 0%, #000 100%); color: #fff; z-index: 35000; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; overflow-y: auto; padding-bottom: 50px;">
    <button onclick="window.hideCryptoWallet()" style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: #ff0055; font-size: 2rem; cursor: pointer;"><i class="fa-solid fa-xmark"></i></button>
    
    <div style="margin-top: 50px; text-align: center;">
        <i class="fa-brands fa-ethereum" style="font-size: 4rem; color: #b700ff; filter: drop-shadow(0 0 20px #b700ff); margin-bottom: 20px;"></i>
        <h1 style="margin: 0; font-size: 2rem; letter-spacing: 2px; color: #fff;">Ride-to-Earn Vault</h1>
        <p style="color: #00ffcc; font-weight: bold; margin-top: 5px;">Réseau Web3 Sécurisé</p>
    </div>

    <div style="margin: 40px auto; width: 90%; max-width: 400px; background: rgba(255,255,255,0.05); border: 1px solid rgba(183,0,255,0.3); border-radius: 20px; padding: 40px 20px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
        <h3 style="color: #aaa; margin: 0 0 10px 0; font-size: 1rem;">Solde Total</h3>
        <div id="crypto-balance" style="font-size: 3.5rem; font-weight: 900; color: #b700ff; text-shadow: 0 0 20px #b700ff;">0.00 BVC</div>
        <div style="color: #fff; font-size: 1.2rem; margin-top: 10px; opacity: 0.7;">≈ 0.00 €</div>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
        <button style="padding: 15px 40px; background: linear-gradient(90deg, #b700ff, #ff0055); border: none; border-radius: 30px; color: #fff; font-weight: 900; font-size: 1.2rem; box-shadow: 0 5px 20px rgba(183,0,255,0.4); cursor: pointer;">CONVERTIR EN ESSENCE</button>
    </div>
</div>
`;
if (!html.includes('id="crypto-wallet-screen"')) {
    html = html.replace('</body>', cryptoWalletUI + '\n    <script src="js/silicon-valley.js"></script>\n</body>');
}

// 4. Update the Smart Dock to add AR and Wallet Buttons
const dockARBtn = `
        <!-- AR Vision -->
        <button id="dock-btn-ar" onclick="window.toggleARVision()" style="background: none; border: none; color: #00ffcc; font-size: 1.5rem; cursor: pointer; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); padding: 5px;">
            <i class="fa-solid fa-vr-cardboard" style="filter: drop-shadow(0 0 5px #00ffcc);"></i>
        </button>
`;
const dockWalletBtn = `
        <!-- Crypto Wallet -->
        <button id="dock-btn-wallet" onclick="window.showCryptoWallet()" style="background: none; border: none; color: #b700ff; font-size: 1.5rem; cursor: pointer; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); padding: 5px;">
            <i class="fa-brands fa-ethereum" style="filter: drop-shadow(0 0 5px #b700ff);"></i>
        </button>
`;

if (!html.includes('id="dock-btn-ar"')) {
    html = html.replace('<!-- Radar Social -->', dockARBtn + '\n' + dockWalletBtn + '\n        <!-- Radar Social -->');
}

fs.writeFileSync('index.html', html);
console.log('Silicon Valley UI injected');
