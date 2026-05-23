const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Inject the script tag
if (!html.includes('jarvis-voice.js')) {
    html = html.replace('</body>', '    <script src="js/jarvis-voice.js"></script>\n</body>');
}

// Inject the Microphone visualizer on the HUD
const micUI = `
    <!-- JARVIS MIC ICON -->
    <div id="jarvis-mic-hud" style="position:fixed; top:20px; right:20px; z-index:25000; background:rgba(0,0,0,0.7); backdrop-filter:blur(5px); border:1px solid rgba(255,255,255,0.2); border-radius:50%; width:50px; height:50px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 15px rgba(0,0,0,0.5);">
        <i id="jarvis-mic-icon" class="fa-solid fa-microphone" style="color: #555; font-size: 1.5rem; transition: color 0.3s;"></i>
    </div>
`;

if (!html.includes('id="jarvis-mic-hud"')) {
    html = html.replace('<!-- WEATHER OVERLAY (Fallback) -->', micUI + '\n    <!-- WEATHER OVERLAY (Fallback) -->');
}

fs.writeFileSync('index.html', html);
console.log('JARVIS UI and Script injected successfully.');
