/**
 * ADMINISTRATIVE TELEMETRY CONSOLE v1.0
 * Real-time field diagnostics for mon50ccetmoi production release.
 */

window.Telemetry = {
    logs: [],
    isVisible: true,
    startTime: Date.now(),

    init: function() {
        console.log("📡 Telemetry Engine: Initializing diagnostics...");
        this.createHUD();
        this.hijackConsole();
        // this.trackGps(); // Désactivé temporairement pour éviter les conflits GPS avec app.js
        this.trackPerformance();
        
        // Auto-refresh UI
        setInterval(() => this.updateHUD(), 1000);
    },

    createHUD: function() {
        const hud = document.createElement('div');
        hud.id = 'telemetry-console';
        hud.className = 'telemetry-glass';
        hud.innerHTML = `
            <div class="telemetry-header">
                <span>SYSTEM_TELEMETRY v50.0.17</span>
                <button onclick="window.Telemetry.toggle()">[X]</button>
            </div>
            <div id="telemetry-stats" class="telemetry-stats">
                <div>UPTIME: <span id="tel-uptime">0s</span></div>
                <div>GPS: <span id="tel-gps">WAITING</span></div>
                <div>MEM: <span id="tel-mem">--</span></div>
            </div>
            <div id="telemetry-logs" class="telemetry-logs"></div>
        `;
        document.body.appendChild(hud);
    },

    hijackConsole: function() {
        const originalLog = console.log;
        const originalError = console.error;
        const self = this;

        console.log = function() {
            self.addLog("INFO", Array.from(arguments).join(" "));
            originalLog.apply(console, arguments);
        };

        console.error = function() {
            self.addLog("ERROR", Array.from(arguments).join(" "));
            originalError.apply(console, arguments);
        };
    },

    addLog: function(type, msg) {
        const timestamp = new Date().toLocaleTimeString();
        this.logs.push({ type, msg, timestamp });
        if (this.logs.length > 50) this.logs.shift();
        
        const logEl = document.getElementById('telemetry-logs');
        if (logEl) {
            const div = document.createElement('div');
            div.className = `log-entry log-${type.toLowerCase()}`;
            div.innerHTML = `<span class="log-time">[${timestamp}]</span> ${msg}`;
            logEl.appendChild(div);
            logEl.scrollTop = logEl.scrollHeight;
        }
    },

    trackGps: function() {
        if ('geolocation' in navigator) {
            navigator.geolocation.watchPosition(
                (pos) => {
                    const gpsStatus = document.getElementById('tel-gps');
                    if (gpsStatus) gpsStatus.textContent = `FIX (${pos.coords.accuracy.toFixed(1)}m)`;
                    if (pos.coords.accuracy > 50) {
                        this.addLog("WARN", `Low GPS Accuracy: ${pos.coords.accuracy}m`);
                    }
                },
                (err) => {
                    const gpsStatus = document.getElementById('tel-gps');
                    if (gpsStatus) gpsStatus.textContent = "ERROR: " + err.code;
                    this.addLog("ERROR", "GPS Failure: " + err.message);
                },
                { enableHighAccuracy: true }
            );
        }
    },

    trackPerformance: function() {
        if (window.performance && window.performance.memory) {
            setInterval(() => {
                const mem = (window.performance.memory.usedJSHeapSize / 1048576).toFixed(1);
                const memEl = document.getElementById('tel-mem');
                if (memEl) memEl.textContent = `${mem} MB`;
            }, 5000);
        }
    },

    updateHUD: function() {
        const uptime = Math.floor((Date.now() - this.startTime) / 1000);
        const uptimeEl = document.getElementById('tel-uptime');
        if (uptimeEl) uptimeEl.textContent = `${uptime}s`;
    },

    toggle: function() {
        const hud = document.getElementById('telemetry-console');
        if (hud) {
            this.isVisible = !this.isVisible;
            hud.style.display = this.isVisible ? 'flex' : 'none';
        }
    }
};

// Auto-start on load
window.addEventListener('load', () => window.Telemetry.init());
