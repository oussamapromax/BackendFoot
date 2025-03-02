const mongoose = require('mongoose');
const Agence = require('../models/AgenceModel');
const Terrain = require('../models/TerrainModel');
const Reservation = require('../models/reservationModel');
const Payment = require('../models/PaymentModel');

// Créer une agence
exports.creerAgence = async (req, res) => {
    try {
        const { nom, adresse, email, telephone } = req.body;
        const agence = new Agence({ nom, adresse, email, telephone });
        await agence.save();
        res.status(201).json({ message: 'Agence créée avec succès', agence });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer toutes les agences
exports.getAgences = async (req, res) => {
    try {
        const agences = await Agence.find();
        res.status(200).json(agences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une agence par ID
exports.getAgenceById = async (req, res) => {
    try {
        const agence = await Agence.findById(req.params.id);
        if (!agence) return res.status(404).json({ message: 'Agence non trouvée' });
        res.status(200).json(agence);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une agence
exports.updateAgence = async (req, res) => {
    try {
        const agence = await Agence.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!agence) return res.status(404).json({ message: 'Agence non trouvée' });
        res.status(200).json({ message: 'Agence mise à jour', agence });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une agence
exports.deleteAgence = async (req, res) => {
    try {
        const agence = await Agence.findByIdAndDelete(req.params.id);
        if (!agence) return res.status(404).json({ message: 'Agence non trouvée' });
        res.status(200).json({ message: 'Agence supprimée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ajouter un terrain à une agence
exports.ajouterTerrain = async (req, res) => {
    try {
        const { id } = req.params;
        const { terrainId } = req.body;

        const agence = await Agence.findById(id);
        if (!agence) return res.status(404).json({ message: 'Agence non trouvée' });

        const terrain = await Terrain.findById(terrainId);
        if (!terrain) return res.status(404).json({ message: 'Terrain non trouvé' });

        agence.terrains.push(terrainId);
        await agence.save();

        res.status(200).json({ message: 'Terrain ajouté à l\'agence', agence });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer un terrain d'une agence
exports.supprimerTerrain = async (req, res) => {
    try {
        const { id, terrainId } = req.params;

        const agence = await Agence.findById(id);
        if (!agence) return res.status(404).json({ message: 'Agence non trouvée' });

        agence.terrains = agence.terrains.filter(terrain => terrain.toString() !== terrainId);
        await agence.save();

        res.status(200).json({ message: 'Terrain supprimé de l\'agence', agence });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Valider une réservation
exports.validerReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { reservationId } = req.body;

        const agence = await Agence.findById(id);
        if (!agence) return res.status(404).json({ message: 'Agence non trouvée' });

        const reservation = await Reservation.findById(reservationId);
        if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });

        reservation.statut = 'confirmed';
        await reservation.save();

        res.status(200).json({ message: 'Réservation validée', reservation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Valider un paiement
exports.validerPaiement = async (req, res) => {
    try {
        const { id } = req.params;
        const { paiementId } = req.body;

        const agence = await Agence.findById(id);
        if (!agence) return res.status(404).json({ message: 'Agence non trouvée' });

        const paiement = await Payment.findById(paiementId);
        if (!paiement) return res.status(404).json({ message: 'Paiement non trouvé' });

        paiement.statut = 'completed';
        await paiement.save();

        res.status(200).json({ message: 'Paiement validé', paiement });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Consulter les statistiques de l'agence
exports.consulterStatistiques = async (req, res) => {
    try {
        const { id } = req.params;
        const agence = await Agence.findById(id);
        if (!agence) return res.status(404).json({ message: 'Agence non trouvée' });

        const totalTerrains = agence.terrains.length;
        const totalReservations = await Reservation.countDocuments({ agenceId: id });
        const totalPaiements = await Payment.countDocuments({ agenceId: id });

        res.status(200).json({ totalTerrains, totalReservations, totalPaiements });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};