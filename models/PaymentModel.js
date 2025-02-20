const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    reservationId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Reservation', 
        required: true, 
        unique: true // Une réservation ne peut avoir qu'un seul paiement
    },
    montant: { 
        type: Number, 
        required: true,
        validate: {
            validator: function(value) {
                return value > 0; // Le montant doit être positif
            },
            message: 'Le montant doit être supérieur à 0.'
        }
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
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Méthode pour effectuer le paiement
paymentSchema.methods.effectuerPaiement = async function () {
    const reservation = await mongoose.model('Reservation').findById(this.reservationId);
    if (!reservation) {
        throw new Error('Réservation non trouvée');
    }

    if (this.montant >= reservation.montantTotal) {
        this.statut = 'completed';
        reservation.statut = 'confirmed';
    } else {
        this.statut = 'failed';
        reservation.statut = 'pending';
    }

    await reservation.save();
    return this.save();
};

// Méthode pour vérifier le statut du paiement
paymentSchema.methods.verifierStatutPaiement = function () {
    return this.statut;
};

module.exports = mongoose.model('Payment', paymentSchema);