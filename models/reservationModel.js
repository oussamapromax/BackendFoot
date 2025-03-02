const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    playerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    terrainId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Terrain', 
        required: true 
    },
    date: { type: Date, required: true },
    heureDebut: { type: String, required: true }, // Format "HH:MM"
    heureFin: { type: String, required: true },   // Format "HH:MM"
    statut: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    montantTotal: { type: Number, required: true }, // Montant total de la réservation
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }, // Rendre ce champ facultatif
    agenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agence', required: true } // Champ obligatoire
});

module.exports = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);