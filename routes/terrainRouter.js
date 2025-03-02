const express = require('express');
const router = express.Router();
const terrainController = require('../controllers/terrainController');
const upload = require('../middlewares/uploadFile');

router.post('/create', upload.single('image'), terrainController.createTerrain);
router.get('/', terrainController.getTerrains);
router.get('/:id', terrainController.getTerrainById);
router.put('/:id', terrainController.updateTerrain);
router.delete('/:id', terrainController.deleteTerrain);
// Nouvelles routes
router.post('/:id/disponibilites', terrainController.ajouterDisponibilite); // Ajouter une disponibilité
router.delete('/:id/disponibilites/:disponibiliteId', terrainController.supprimerDisponibilite); // Supprimer une disponibilité
router.put('/:id/tarif',terrainController.mettreAJourTarif); // Mettre à jour le tarif horaire

module.exports = router;