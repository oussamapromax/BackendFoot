const mongoose = require('mongoose');
const Notification = require('../models/NotificationModel');
const Player = require('../models/userSchema');

// Créer une notification et l'ajouter au joueur
exports.createNotification = async (req, res) => {
    try {
        const { playerId, message, type } = req.body;

        if (!mongoose.Types.ObjectId.isValid(playerId)) {
            return res.status(400).json({ message: 'Invalid playerId' });
        }

        const player = await Player.findById(playerId);
        if (!player) return res.status(404).json({ message: 'Player not found' });

        const notification = new Notification({ playerId, message, type });
        await notification.save();

        // Ajouter la notification à la liste du joueur
        player.notifications.push(notification._id);
        await player.save();

        notification.envoyerNotification();

        return res.status(201).json({ message: 'Notification créée', notification });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Récupérer toutes les notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().populate('playerId');
        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Récupérer une notification par ID
exports.getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid notification ID' });
        }

        const notification = await Notification.findById(id).populate('playerId');
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        return res.status(200).json(notification);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Récupérer les notifications d'un joueur
exports.getNotificationByPlayerId = async (req, res) => {
    try {
        const { playerId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(playerId)) {
            return res.status(400).json({ message: 'Invalid playerId' });
        }

        const notifications = await Notification.find({ playerId }).populate('playerId');
        if (!notifications.length) {
            return res.status(404).json({ message: 'Aucune notification trouvée pour ce joueur' });
        }

        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Mettre à jour une notification (ex : marquer comme lue)
exports.updateNotification = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid notification ID' });
        }

        const notification = await Notification.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!notification) return res.status(404).json({ message: 'Notification non trouvée' });

        return res.status(200).json(notification);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Supprimer une notification et l’enlever du joueur
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid notification ID' });
        }

        const notification = await Notification.findByIdAndDelete(id);
        if (!notification) return res.status(404).json({ message: 'Notification non trouvée' });

        // Supprimer la notification de la liste du joueur
        await Player.findByIdAndUpdate(notification.playerId, { $pull: { notifications: id } });

        return res.status(200).json({ message: 'Notification supprimée' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
