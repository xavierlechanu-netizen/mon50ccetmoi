const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const timCookUI = `
<!-- TIM COOK SCREENS -->
<div id="tim-cook-sos-screen" class="hidden fullscreen-overlay" style="background: rgba(255,0,0,0.95); color: #fff; z-index: 30000; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <i class="fa-solid fa-triangle-exclamation fa-beat" style="font-size: 5rem; color: #fff; margin-bottom: 20px;"></i>
    <h1 style="font-size: 3rem; margin: 0; text-transform: uppercase; letter-spacing: 5px; text-align:center;">Choc Détecté</h1>
    <p style="font-size: 1.2rem; margin: 10px 0 30px; text-align:center;">Appel SOS aux urgences dans :</p>
    <div id="sos-countdown" style="font-size: 6rem; font-weight: 900;">10</div>
    <button onclick="window.cancelSOS()" style="margin-top: 40px; padding: 20px 50px; font-size: 1.5rem; font-weight: bold; background: #fff; color: #ff0000; border: none; border-radius: 40px; cursor: pointer; box-shadow: 0 0 20px rgba(255,255,255,0.5);">ANNULER L'ALERTE</button>
</div>

<div id="tim-cook-eco-screen" class="hidden fullscreen-overlay" style="background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); color: #fff; z-index: 25000; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.5s;">
    <i class="fa-solid fa-leaf" style="font-size: 4rem; color: #00ff00; filter: drop-shadow(0 0 15px #00ff00); margin-bottom: 20px;"></i>
    <h2 style="font-size: 2rem; color: #00ff00; margin: 0;">Bilan Carbone</h2>
    <p style="font-size: 1.2rem; color: #aaa; margin: 10px 0 20px;">Comparé à une voiture classique</p>
    <div style="font-size: 3rem; font-weight: 900; color: #fff; text-shadow: 0 0 10px #00ff00;"><span id="eco-saved-data">0g</span></div>
    <p style="font-size: 1rem; color: #888; margin-top: 10px;">Merci de préserver la planète.</p>
</div>

<script src="js/tim-cook.js"></script>
</body>`;

html = html.replace('</body>', timCookUI);
fs.writeFileSync('index.html', html);
console.log('Tim Cook UI injected');
