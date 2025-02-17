const express = require('express');
const router = express.Router();
const avisController = require('../controllers/avisController');

router.post('/', avisController.createAvis);
router.get('/', avisController.getAvis);
router.get('/:id', avisController.getAvisById);
router.put('/:id', avisController.updateAvis);
router.delete('/:id', avisController.deleteAvis);

module.exports = router;