const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Add a STOP button to trigger the Eco Report (for testing)
const stopBtn = `
    <!-- END RIDE BUTTON -->
    <div onclick="window.generateEcoReport()" style="position:fixed; top:80px; right:20px; z-index:25000; background:rgba(255,0,85,0.8); backdrop-filter:blur(5px); border:1px solid rgba(255,255,255,0.2); border-radius:10px; padding:10px 15px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 15px rgba(255,0,85,0.5); cursor:pointer;">
        <i class="fa-solid fa-flag-checkered" style="color: #fff; margin-right: 8px;"></i> <span style="color:#fff; font-weight:bold; font-size: 0.9rem;">ARRIVÉE</span>
    </div>
`;

if (!html.includes('ARRIVÉE')) {
    html = html.replace('<!-- WEATHER OVERLAY (Fallback) -->', stopBtn + '\n    <!-- WEATHER OVERLAY (Fallback) -->');
    fs.writeFileSync('index.html', html);
    console.log('End Ride button added.');
}
