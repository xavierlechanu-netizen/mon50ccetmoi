const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove old scattered buttons
html = html.replace(/<button id="btn-social-radar"[\s\S]*?<\/button>/g, '');
html = html.replace(/<button id="btn-sensation-mode"[\s\S]*?<\/button>/g, '');
html = html.replace(/<button id="btn-leaderboard-fab"[\s\S]*?<\/button>/g, '');
// The vehicle config button has a specific onclick
html = html.replace(/<button onclick="document.getElementById\('vehicle-config-screen'\).classList.remove\('hidden'\)"[\s\S]*?<\/button>/g, '');

// 2. Remove the misplaced </body>
html = html.replace(/<\/body>/g, '');

// 3. Define the Apple Smart Dock
const smartDock = `
    <!-- APPLE SMART DOCK -->
    <div id="apple-smart-dock" style="position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 10000; display: flex; gap: 20px; padding: 15px 25px; border-radius: 40px; background: rgba(25, 25, 35, 0.4); backdrop-filter: blur(25px) saturate(200%); border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2);">
        
        <!-- Radar Social -->
        <button id="dock-btn-radar" onclick="window.toggleSocialRadar()" style="background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); padding: 5px;">
            <i class="fa-solid fa-users-viewfinder" style="filter: drop-shadow(0 0 5px #00d2ff);"></i>
        </button>

        <!-- Sensation Mode -->
        <button id="dock-btn-sensation" onclick="window.toggleSensationMode()" style="background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); padding: 5px;">
            <i class="fa-solid fa-route" style="filter: drop-shadow(0 0 5px #b700ff);"></i>
        </button>

        <!-- Neural AI Evolution -->
        <button id="dock-btn-brain" onclick="window.startEvolutionProtocol()" style="background: none; border: none; color: #fff; font-size: 1.8rem; cursor: pointer; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); padding: 0 10px;">
            <i class="fa-solid fa-brain" style="color: #0f0; filter: drop-shadow(0 0 10px #0f0);"></i>
        </button>

        <!-- Vehicle Profile -->
        <button id="dock-btn-moto" onclick="document.getElementById('vehicle-config-screen').classList.remove('hidden')" style="background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); padding: 5px;">
            <i class="fa-solid fa-motorcycle" style="filter: drop-shadow(0 0 5px #aaa);"></i>
        </button>

        <!-- Hall of Fame / Trophy -->
        <button id="dock-btn-trophy" onclick="window.showLeaderboard()" style="background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); padding: 5px;">
            <i class="fa-solid fa-trophy" style="filter: drop-shadow(0 0 5px #ffb703);"></i>
        </button>

    </div>

    <!-- Style for Hover Effects -->
    <style>
        #apple-smart-dock button:hover {
            transform: scale(1.3) translateY(-10px);
        }
        #apple-smart-dock button:active {
            transform: scale(0.9);
        }
    </style>
</body>
`;

html = html + smartDock;

fs.writeFileSync('index.html', html);
console.log('index.html refactored successfully.');
