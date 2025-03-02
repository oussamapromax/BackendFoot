const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
// Superviser une agence
router.post('/superviser-agence', adminController.superviserAgence);

// Consulter les statistiques
router.get('/consulter-statistiques', adminController.consulterStatistiques);

module.exports = router;