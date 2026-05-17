const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(targetPath, 'utf8');

// Replace the title
html = html.replace(/<title>.*?<\/title>/, '<title>mon 50cc et moi | v60.0.0</title>');

// Replace cache busters
html = html.replace(/\?v=52035/g, '?v=60000');
html = html.replace(/\?v=30\.2/, '?v=60.0');

fs.writeFileSync(targetPath, html);
console.log('index.html updated successfully.');
