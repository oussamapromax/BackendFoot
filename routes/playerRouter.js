const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");

// ✅ Réserver un terrain
router.get("/chercher", playerController.chercherTerrain);

// ✅ Donner un avis
router.post("/donner-avis", playerController.donnerAvis);

// ✅ Payer une réservation
router.post("/payer-reservation", playerController.payerReservation);

module.exports = router;