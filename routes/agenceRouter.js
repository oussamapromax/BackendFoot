const express = require('express');
const router = express.Router();
const agenceController = require('../controllers/AgenceController');

// Créer une agence
router.post('/creer-agence', agenceController.creerAgence);

// Récupérer toutes les agences
router.get('/agences', agenceController.getAgences);

// Récupérer une agence par ID
router.get('/agences/:id', agenceController.getAgenceById);

// Mettre à jour une agence
router.put('/agences/:id', agenceController.updateAgence);

// Supprimer une agence
router.delete('/agences/:id', agenceController.deleteAgence);

// Ajouter un terrain à une agence
router.post('/agences/:id/ajouter-terrain', agenceController.ajouterTerrain);

// Supprimer un terrain d'une agence
router.delete('/agences/:id/supprimer-terrain/:terrainId', agenceController.supprimerTerrain);

// Valider une réservation (par l'agence)
router.post('/agences/:id/valider-reservation', agenceController.validerReservation);

// Valider un paiement (par l'agence)
router.post('/agences/:id/valider-paiement', agenceController.validerPaiement);

// Consulter les statistiques de l'agence
router.get('/agences/:id/statistiques', agenceController.consulterStatistiques);

module.exports = router;