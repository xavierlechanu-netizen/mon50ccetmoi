const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Inject the manifest
if (!html.includes('manifest.json')) {
    html = html.replace('</head>', '    <link rel="manifest" href="manifest.json">\n</head>');
}

// Inject the Service Worker registration
const swScript = `
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js').then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
            });
        }
    </script>
`;

if (!html.includes("serviceWorker.register('sw.js')")) {
    html = html.replace('</body>', swScript + '</body>');
}

fs.writeFileSync('index.html', html);
console.log('PWA Manifest and Service Worker injected successfully.');
