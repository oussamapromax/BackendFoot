const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/', paymentController.createPayment); // Créer un paiement
router.get('/', paymentController.getPayments); // Obtenir tous les paiements
router.get('/:id', paymentController.getPaymentById); // Obtenir un paiement par ID
router.put('/:id/effectuer', paymentController.effectuerPaiement); // Effectuer un paiement
router.get('/:id/statut', paymentController.verifierStatutPaiement); // Vérifier le statut d'un paiement
router.delete('/:id', paymentController.deletePayment); // Supprimer un paiement si possible

module.exports = router;
