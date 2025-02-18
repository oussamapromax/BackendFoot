const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    reservationId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Reservation', 
        required: true, 
        unique: true // Une réservation ne peut avoir qu'un seul paiement
    },
    montant: { type: Number, required: true },
    methode: { type: String, enum: ['carte', 'espèce', 'virement'], required: true },
    statut: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

// Méthode pour effectuer le paiement
paymentSchema.methods.effectuerPaiement = function () {
    this.statut = 'completed';
    return this.save();
};

// Méthode pour vérifier le statut du paiement
paymentSchema.methods.verifierStatutPaiement = function () {
    return this.statut;
};

module.exports = mongoose.model('Payment', paymentSchema);
