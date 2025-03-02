const mongoose = require('mongoose');


const agenceSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    adresse: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String, required: true },
    terrains: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Terrain' }],
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
    paiements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }]
});

// Méthode pour gérer les terrains
agenceSchema.methods.ajouterTerrain = async function (terrainId) {
    this.terrains.push(terrainId);
    await this.save();
};

// Méthode pour valider une réservation
agenceSchema.methods.validerReservation = async function (reservationId) {
    const reservation = await mongoose.model('Reservation').findById(reservationId);
    if (!reservation) {
        throw new Error('Réservation non trouvée');
    }
    reservation.statut = 'confirmed';
    await reservation.save();
};

// Méthode pour valider un paiement
agenceSchema.methods.validerPaiement = async function (paiementId) {
    const paiement = await mongoose.model('Payment').findById(paiementId);
    if (!paiement) {
        throw new Error('Paiement non trouvé');
    }
    paiement.statut = 'completed';
    await paiement.save();
};

// Méthode pour consulter les statistiques
agenceSchema.methods.consulterStatistiques = async function () {
    const totalTerrains = this.terrains.length;
    const totalReservations = this.reservations.length;
    const totalPaiements = this.paiements.length;

    return { totalTerrains, totalReservations, totalPaiements };
};

module.exports = mongoose.model('Agence', agenceSchema);