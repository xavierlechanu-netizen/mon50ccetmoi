/**
 * PORTAIL ASSURANCE mon50ccetmoi
 * Gestion des paiements et accès aux rapports d'expertise.
 */
window.InsurancePortal = {
    config: {
        stripe_public_key: "sup_pk_Jz8vwY0cBIDOA1TbquCYDoUh6s3udRaey", // Clé publique
        // ATTENTION : Ne JAMAIS mettre de clé privée (secret key) ici.
        // Les clés privées doivent être gérées côté serveur (ex: Firebase Functions).
    },

    balance: 500.00, // Option 2: Portefeuille virtuel (Acompte)
    transactions: [], // Historique des transactions
    cases: {}, // Liste des dossiers en attente ou débloqués

    init() {
        console.log("mon50cc Insurance Portal : [ INITIALIZED ]");
    },

    notify(message) {
        speak(message);
        console.log("[Portal Notification]", message);
        // On pourrait ajouter un toast UI ici si besoin
    },


    // Affiche l'interface du portail pro
    showPortal(caseId) {
        const overlay = document.getElementById('screen-overlay');
        const content = document.getElementById('screen-content');
        if (!overlay || !content) return;

        overlay.classList.remove('hidden');
        this.renderPortal(content, caseId);
    },

    renderPortal(container, caseId) {
        const isUnlocked = this.cases[caseId]?.unlocked;
        const status = this.cases[caseId]?.status || 'pending_payment';

        container.innerHTML = `
            <div class="insurance-portal-container">
                <h3><i class="fa-solid fa-building-shield"></i> Portail Pro Assurance</h3>
                <div class="wallet-status">
                    <span>Votre Solde :</span>
                    <strong id="portal-balance">${this.balance.toFixed(2)} €</strong>
                </div>

                <div class="case-header">
                    <h4>Dossier : <span class="case-id">${caseId}</span></h4>
                    <p class="case-status status-${status}">${this.getStatusLabel(status)}</p>
                </div>

                ${isUnlocked ? this.renderUnlockedView(caseId) : this.renderPaymentOptions(caseId)}

                ${this.renderTransactionHistory()}

                <button onclick="document.getElementById('screen-overlay').classList.add('hidden')" class="btn-close-portal">

                    <i class="fa-solid fa-times"></i> Fermer le Portail
                </button>
            </div>
        `;
    },

    renderPaymentOptions(caseId) {
        return `
            <div class="payment-selection">
                <p>Pour accéder aux données certifiées (G-Force, Télémétrie, Inclinaison), veuillez choisir une méthode de règlement :</p>
                
                <div class="payment-option" onclick="InsurancePortal.payInstant('${caseId}')">
                    <div class="option-icon"><i class="fa-solid fa-bolt"></i></div>
                    <div class="option-details">
                        <strong>Option 1 : Virement Instantané</strong>
                        <span>Libération immédiate (10s) via Stripe/Fintecture.</span>
                    </div>
                    <div class="option-price">49.99€</div>
                </div>

                <div class="payment-option" onclick="InsurancePortal.payWithWallet('${caseId}')">
                    <div class="option-icon"><i class="fa-solid fa-wallet"></i></div>
                    <div class="option-details">
                        <strong>Option 2 : Portefeuille Virtuel</strong>
                        <span>Débit immédiat de votre acompte professionnel.</span>
                    </div>
                    <div class="option-price">49.99€</div>
                </div>

                <div class="payment-option" onclick="InsurancePortal.uploadProof('${caseId}')">
                    <div class="option-icon"><i class="fa-solid fa-file-invoice-dollar"></i></div>
                    <div class="option-details">
                        <strong>Option 3 : Preuve de Virement</strong>
                        <span>Déblocage sur justificatif (PDF).</span>
                    </div>
                    <div class="option-price">49.99€</div>
                </div>
            </div>
        `;
    },

    renderUnlockedView(caseId) {
        return `
            <div class="unlocked-view">
                <p class="success-msg"><i class="fa-solid fa-circle-check"></i> Rapport débloqué avec succès.</p>
                <button onclick="window.BlackBoxInsurance.generateReport()" class="btn-download-report">
                    <i class="fa-solid fa-file-pdf"></i> Télécharger le Rapport Certifié
                </button>
                <button onclick="window.BlackBoxReplay.replay()" class="btn-replay-report">
                    <i class="fa-solid fa-play"></i> Rejouer le Trajet en 3D
                </button>
            </div>
        `;
    },

    getStatusLabel(status) {
        const labels = {
            'pending_payment': 'En attente de paiement',
            'waiting_for_funds': 'Virement en cours (Attente réception)',
            'pending_verification': 'Vérification de la preuve en cours',
            'unlocked': 'Accès Autorisé'
        };
        return labels[status] || status;
    },


    // OPTION 1 : Virement Instantané
    payInstant(caseId) {
        speak("Initialisation du virement instantané. En attente de réception des fonds par la banque.");
        this.cases[caseId] = { status: 'waiting_for_funds', unlocked: false };
        this.showPortal(caseId); // Refresh UI to show waiting state
        
        // Simulation du délai bancaire SEPA Instant (ex: 10s)
        setTimeout(() => {
            this.unlockCase(caseId, 'instant_sepa');
            if (document.getElementById('screen-overlay').classList.contains('hidden') === false) {
                this.showPortal(caseId); // Refresh UI to show unlocked state
            }
            speak("Fonds reçus instantanément. Rapport débloqué.");
        }, 8000);
    },

    // OPTION 2 : Portefeuille
    payWithWallet(caseId) {
        if (this.balance >= 49.99) {
            this.balance -= 49.99;
            this.unlockCase(caseId, 'wallet_debit');
            this.showPortal(caseId); // Refresh
            speak("Débit effectué sur votre compte pro. Rapport accessible.");
        } else {
            alert("Solde insuffisant sur votre portefeuille virtuel.");
            speak("Solde insuffisant.");
        }
    },

    // OPTION 3 : Preuve de virement
    uploadProof(caseId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.cases[caseId] = { status: 'pending_verification', unlocked: false };
                this.showPortal(caseId);
                speak("Preuve de virement reçue. Notre système vérifie le document.");
                
                // Simulation de validation automatique après 5s
                setTimeout(() => {
                    this.unlockCase(caseId, 'proof_validated');
                    if (document.getElementById('screen-overlay').classList.contains('hidden') === false) {
                        this.showPortal(caseId);
                    }
                    speak("Justificatif validé. Le rapport est maintenant débloqué.");
                }, 5000);
            }
        };
        input.click();
    },

    renderTransactionHistory() {
        if (this.transactions.length === 0) return '';
        
        return `
            <div class="transaction-history">
                <h5><i class="fa-solid fa-clock-rotate-left"></i> Historique des Transactions</h5>
                <div class="transaction-list">
                    ${this.transactions.map(t => `
                        <div class="transaction-item">
                            <span>${new Date(t.date).toLocaleTimeString()} - ${t.caseId}</span>
                            <span class="t-amount">-${t.amount}€</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    unlockCase(caseId, method) {
        const amount = 49.99;
        this.cases[caseId] = { 
            status: 'unlocked', 
            unlocked: true, 
            method: method,
            timestamp: Date.now() 
        };
        
        this.transactions.unshift({
            date: Date.now(),
            caseId: caseId,
            amount: amount,
            method: method
        });

        this.notify(`Transaction confirmée pour le dossier ${caseId}.`);
    }
};

