const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");


// Middleware pour restreindre l'accès aux admins uniquement

// Routes Admin
router.post("/gerer-utilisateurs", adminController.gererUtilisateurs);
router.post("/gerer-terrains", adminController.gererTerrains);
router.get("/statistiques", adminController.consulterStatistiques);
// Valider un paiement
router.post("/valider-paiement", adminController.validerPaiement);

// Envoyer une notification à un joueur
router.post("/envoyer-notification", adminController.envoyerNotification);
module.exports = router;
