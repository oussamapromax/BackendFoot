const express = require('express');
const router = express.Router();
const terrainController = require('../controllers/terrainController');
const upload = require('../middlewares/uploadFile');

router.post('/', upload.single('image'), terrainController.createTerrain);
router.get('/', terrainController.getTerrains);
router.get('/:id', terrainController.getTerrainById);
router.put('/:id', terrainController.updateTerrain);
router.delete('/:id', terrainController.deleteTerrain);

module.exports = router;