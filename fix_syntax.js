const fs = require('fs');

function fixSyntax(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    // Replace incorrectly escaped single quotes within single-quoted strings
    // E.g., 'Moteur d\\'évolution' -> "Moteur d'évolution"
    content = content.replace(/'Attention\. Moteur d\\\\'évolution neuronale activé\. L\\\\'application se réécrit elle-même\.'/g, '"Attention. Moteur d\'évolution neuronale activé. L\'application se réécrit elle-même."');
    content = content.replace(/'Erreur d\\\\'accès à la caméra pour la réalité augmentée\.'/g, '"Erreur d\'accès à la caméra pour la réalité augmentée."');
    content = content.replace(/'Alerte critique\. Chute détectée\. Vous avez 10 secondes pour annuler avant l\\\\'envoi des secours\.'/g, '"Alerte critique. Chute détectée. Vous avez 10 secondes pour annuler avant l\'envoi des secours."');
    
    // Also try without double backslashes just in case
    content = content.replace(/'Attention\. Moteur d\\'évolution neuronale activé\. L\\'application se réécrit elle-même\.'/g, '"Attention. Moteur d\'évolution neuronale activé. L\'application se réécrit elle-même."');
    content = content.replace(/'Erreur d\\'accès à la caméra pour la réalité augmentée\.'/g, '"Erreur d\'accès à la caméra pour la réalité augmentée."');
    content = content.replace(/'Alerte critique\. Chute détectée\. Vous avez 10 secondes pour annuler avant l\\'envoi des secours\.'/g, '"Alerte critique. Chute détectée. Vous avez 10 secondes pour annuler avant l\'envoi des secours."');
    
    fs.writeFileSync(file, content, 'utf8');
}

fixSyntax('js/self-evolution.js');
fixSyntax('js/silicon-valley.js');
fixSyntax('js/tim-cook.js');
console.log('Syntax fixes applied');
