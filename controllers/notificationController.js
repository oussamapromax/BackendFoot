const mongoose = require('mongoose');
const Notification = require('../models/NotificationModel');
const Player = require('../models/Player');

exports.createNotification = async (req, res) => {
    try {
        const { playerId, message } = req.body;

        // Vérifier si playerId est un ObjectId valide
        if (!mongoose.Types.ObjectId.isValid(playerId)) {
            return res.status(400).json({ message: 'Invalid playerId' });
        }

        // Vérifier si le joueur existe
        const player = await Player.findById(playerId);
        if (!player) return res.status(404).json({ message: 'Player not found' });

        // Créer et sauvegarder la notification
        const notification = new Notification({ playerId, message });
        await notification.save();

        // Ajouter la notification au Player
        player.notifications.push(notification._id);
        await player.save();

        return res.status(201).json({ notification });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().populate('playerId').lean();
        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si l'ID est valide
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid notification ID' });
        }

        const notification = await Notification.findById(id).populate('playerId').lean();
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        return res.status(200).json(notification);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getNotificationByPlayerId = async (req, res) => {
    try {
        const { playerId } = req.params;
        const notifications = await Notification.find({ playerId }).populate('playerId').lean();
        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found for this player' });
        }
        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateNotification = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si l'ID est valide
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid notification ID' });
        }

        const notification = await Notification.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        return res.status(200).json(notification);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si l'ID est valide
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid notification ID' });
        }

        const notification = await Notification.findByIdAndDelete(id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        return res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
