const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');





// Routes spécifiques au Player
router.post('/reserver-terrain', playerController.reserverTerrain);
router.post('/donner-avis', playerController.donnerAvis);
router.post('/payer-reservation', playerController.payerReservation);

module.exports = router;
