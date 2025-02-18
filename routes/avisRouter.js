const express = require('express');
const router = express.Router();
const avisController = require('../controllers/avisController');

router.post('/', avisController.ajouterAvis); // Changer createAvis → ajouterAvis
router.get('/', avisController.getAvis);
router.get('/:id', avisController.getAvisById);
router.put('/:id', avisController.modifierAvis); // Changer updateAvis → modifierAvis
router.delete('/:id', avisController.supprimerAvis); // Changer deleteAvis → supprimerAvis

// Routes supplémentaires pour récupérer les avis par joueur et par terrain
router.get('/player/:playerId', avisController.getAvisByPlayerId);
router.get('/terrain/:terrainId', avisController.getAvisByTerrainId);

module.exports = router;
