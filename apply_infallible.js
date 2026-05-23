const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Inject Watchdog script at the top of <head>
if (!html.includes('infallible.js')) {
    html = html.replace('<head>', '<head>\n    <!-- WATCHDOG ANTI-CRASH -->\n    <script src="js/infallible.js"></script>');
}

// 2. Inject Tunnel UI Overlay
const tunnelUI = `
    <!-- TUNNEL / DEAD RECKONING WARNING -->
    <div id="tunnel-warning" class="hidden" style="position:fixed; top:80px; left:50%; transform:translateX(-50%); z-index:20000; background:rgba(0,0,0,0.8); border:2px solid #ffaa00; border-radius:30px; padding:10px 20px; display:flex; align-items:center; gap:15px; box-shadow:0 0 20px #ffaa00;">
        <i class="fa-solid fa-satellite-dish fa-fade" style="color:#ffaa00; font-size:1.5rem;"></i>
        <span style="color:#ffaa00; font-weight:900; letter-spacing:1px;">PERTE SIGNAL - NAVIGATION MATHÉMATIQUE</span>
    </div>
`;

if (!html.includes('id="tunnel-warning"')) {
    html = html.replace('<!-- BIOMETRIC SYNC -->', tunnelUI + '\n    <!-- BIOMETRIC SYNC -->');
}

fs.writeFileSync('index.html', html);
console.log('Infallible architecture injected');
