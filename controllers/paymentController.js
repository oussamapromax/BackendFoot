const Payment = require('../models/PaymentModel');
const Reservation = require('../models/reservationModel');

// Créer un paiement (uniquement s'il n'existe pas déjà pour la réservation)
exports.createPayment = async (req, res) => {
    try {
        const { reservationId, montant, methode } = req.body;

        // Vérifier si la réservation existe
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ error: 'Réservation non trouvée' });
        }

        // Vérifier si un paiement existe déjà pour cette réservation
        const existingPayment = await Payment.findOne({ reservationId });
        if (existingPayment) {
            return res.status(400).json({ error: 'Un paiement existe déjà pour cette réservation' });
        }

        // Créer le paiement
        const payment = new Payment({ reservationId, montant, methode, statut: 'pending' });
        await payment.save();

        res.status(201).json({ message: 'Paiement créé avec succès', payment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtenir tous les paiements
exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('reservationId');
        res.status(200).json(payments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtenir un paiement par ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('reservationId');
        if (!payment) return res.status(404).json({ error: 'Paiement non trouvé' });
        res.status(200).json(payment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Effectuer un paiement (changer le statut à "completed")
exports.effectuerPaiement = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findById(id);
        if (!payment) return res.status(404).json({ message: 'Paiement non trouvé' });

        await payment.effectuerPaiement();
        res.status(200).json({ message: 'Paiement effectué avec succès', payment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Vérifier le statut d'un paiement
exports.verifierStatutPaiement = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findById(id);
        if (!payment) return res.status(404).json({ message: 'Paiement non trouvé' });

        res.status(200).json({ statut: payment.verifierStatutPaiement() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un paiement (uniquement si la réservation est annulée)
exports.deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findById(id);
        if (!payment) return res.status(404).json({ message: 'Paiement non trouvé' });

        const reservation = await Reservation.findById(payment.reservationId);
        if (reservation && reservation.statut !== 'cancelled') {
            return res.status(400).json({ message: 'Impossible de supprimer un paiement actif' });
        }

        await Payment.findByIdAndDelete(id);
        res.status(200).json({ message: 'Paiement supprimé' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
