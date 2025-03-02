const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.post('/create', reservationController.createReservation); // Créer une réservation
router.get('/getAll', reservationController.getReservations); // Obtenir toutes les réservations
router.get('/:id', reservationController.getReservationById); // Obtenir une réservation spécifique
router.put('/:id', reservationController.updateReservation); // Modifier une réservation
router.delete('/:id', reservationController.deleteReservation); // Supprimer une réservation

// Routes supplémentaires pour gérer le statut des réservations
router.put('/:id/annuler', reservationController.annulerReservation); // Annuler une réservation
router.put('/:id/confirmer', reservationController.confirmerReservation); // Confirmer une réservation

module.exports = router;
