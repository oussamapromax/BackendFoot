const Reservation = require('../models/reservationModel');
const Payment = require('../models/PaymentModel');
const Player = require('../models/Player');
const Terrain = require('../models/TerrainModel');

// Créer une réservation avec paiement
exports.createReservation = async (req, res) => {
    try {
        const { playerId, terrainId, date, heureDebut, heureFin, montantTotal } = req.body;

        // Vérifier si le joueur et le terrain existent
        const player = await Player.findById(playerId);
        if (!player) return res.status(404).json({ message: 'Joueur non trouvé' });

        const terrain = await Terrain.findById(terrainId);
        if (!terrain) return res.status(404).json({ message: 'Terrain non trouvé' });

        // Créer le paiement
        const payment = new Payment({ amount: montantTotal, status: 'pending' });
        await payment.save();

        // Créer la réservation
        const reservation = new Reservation({
            playerId,
            terrainId,
            date,
            heureDebut,
            heureFin,
            montantTotal,
            paymentId: payment._id,
            statut: 'pending' // Statut initial
        });

        await reservation.save();

        // Associer le paiement à la réservation
        payment.reservationId = reservation._id;
        await payment.save();

        res.status(201).json({ message: 'Réservation créée', reservation, payment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer toutes les réservations
exports.getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('playerId', 'name') // Afficher le nom du joueur
            .populate('terrainId', 'name location'); // Afficher le nom et l'emplacement du terrain

        res.status(200).json(reservations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Récupérer une réservation par ID
exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('playerId', 'name')
            .populate('terrainId', 'name location');

        if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });

        res.status(200).json(reservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Récupérer les réservations d'un joueur spécifique
exports.getReservationsByPlayerId = async (req, res) => {
    try {
        const { playerId } = req.params;

        const reservations = await Reservation.find({ playerId })
            .populate('terrainId', 'name location');

        res.status(200).json(reservations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Annuler une réservation
exports.annulerReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findByIdAndUpdate(
            id,
            { statut: 'cancelled' },
            { new: true }
        );

        if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });

        res.status(200).json({ message: 'Réservation annulée', reservation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Confirmer une réservation
exports.confirmerReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findByIdAndUpdate(
            id,
            { statut: 'confirmed' },
            { new: true }
        );

        if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });

        res.status(200).json({ message: 'Réservation confirmée', reservation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });

        res.status(200).json({ message: 'Réservation supprimée' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedReservation = await Reservation.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedReservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

