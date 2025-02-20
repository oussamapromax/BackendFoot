const Reservation = require('../models/reservationModel');
const Payment = require('../models/PaymentModel');
const Avis = require('../models/AvisModel');
const mongoose = require('mongoose'); // Vérification des ObjectId
const { Player } = require('../models/userSchema');

// Réserver un terrain
exports.reserverTerrain = async (req, res) => {
    try {
        const { playerId, terrainId, date, heureDebut, heureFin, montantTotal } = req.body;

        if (!mongoose.Types.ObjectId.isValid(playerId)) {
            return res.status(400).json({ message: "ID joueur invalide" });
        }

        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Joueur non trouvé' });
        }

        const reservation = await player.reserveTerrain(terrainId, date, heureDebut, heureFin, montantTotal);
        res.status(201).json({ message: 'Réservation créée', reservation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Donner un avis
exports.donnerAvis = async (req, res) => {
    try {
        const { playerId, terrainId, rating, comment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(playerId)) {
            return res.status(400).json({ message: "ID joueur invalide" });
        }

        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Joueur non trouvé' });
        }

        const avis = await player.giveAvis(terrainId, rating, comment);
        res.status(201).json({ message: 'Avis ajouté', avis });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Payer une réservation
exports.payerReservation = async (req, res) => {
    try {
        const { playerId, reservationId, montant, methode } = req.body;

        if (!mongoose.Types.ObjectId.isValid(playerId) || !mongoose.Types.ObjectId.isValid(reservationId)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Joueur non trouvé' });
        }

        const payment = await player.payerReservation(reservationId, montant, methode);
        res.status(200).json({ message: 'Paiement effectué avec succès', payment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

