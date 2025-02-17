const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Création d'une notification
router.post('/', notificationController.createNotification);

// Récupérer toutes les notifications
router.get('/', notificationController.getNotifications);

// Récupérer les notifications d'un joueur spécifique (placé avant `/:id` pour éviter les conflits)
router.get('/player/:playerId', notificationController.getNotificationByPlayerId);

// Récupérer une notification spécifique par son ID
router.get('/:id', notificationController.getNotificationById);

// Mettre à jour une notification par son ID
router.put('/:id', notificationController.updateNotification);

// Supprimer une notification par son ID
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
