const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
    reservationId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Reservation', 
        required: true 
    },
    montant: { 
        type: Number, 
        required: true 
    },
    methode: { 
        type: String, 
        enum: ['carte', 'espèce', 'virement'], 
        required: true 
    },
    statut: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'], 
        default: 'pending' 
    },
    agenceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Agence', 
        required: true 
    }
});
// Méthode pour effectuer un paiement
paymentSchema.methods.effectuerPaiement = function () {
    this.statut = 'completed'; // Mettre à jour le statut du paiement
    return this.save(); // Sauvegarder les modifications
};
// Méthode pour vérifier le statut du paiement
paymentSchema.methods.verifierStatutPaiement = function () {
    return this.statut; // Retourne le statut actuel du paiement
};
module.exports = mongoose.model('Payment', paymentSchema);