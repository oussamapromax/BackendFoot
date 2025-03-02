const mongoose = require("mongoose");
const Notification = require("../models/NotificationModel");
const User = require("../models/userSchema");

// Créer une notification et l'ajouter au joueur
exports.createNotification = async (req, res) => {
  try {
    const { playerId, message, type } = req.body;

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({ message: "ID de joueur invalide" });
    }

    // Vérifier l'existence du joueur
    const player = await User.findOne({ _id: playerId, role: "Player" });
    if (!player) return res.status(404).json({ message: "Joueur non trouvé ou rôle invalide" });

    // Créer la notification
    const notification = new Notification({ playerId, message, type });
    await notification.save();

    // Ajouter la notification à la liste du joueur
    player.notifications.push(notification._id);
    await player.save();

    res.status(201).json({ message: "Notification créée", notification });
  } catch (error) {
    console.error("Erreur dans createNotification :", error);
    res.status(500).json({ message: "Erreur lors de la création de la notification", error: error.message });
  }
};

// Récupérer toutes les notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate("playerId", "username email");
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Erreur dans getNotifications :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des notifications", error: error.message });
  }
};

// Récupérer une notification par ID
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de notification invalide" });
    }

    // Récupérer la notification
    const notification = await Notification.findById(id).populate("playerId", "username email");
    if (!notification) return res.status(404).json({ message: "Notification non trouvée" });

    res.status(200).json(notification);
  } catch (error) {
    console.error("Erreur dans getNotificationById :", error);
    res.status(500).json({ message: "Erreur lors de la récupération de la notification", error: error.message });
  }
};

// Récupérer les notifications d'un joueur
exports.getNotificationByPlayerId = async (req, res) => {
  try {
    const { playerId } = req.params;

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({ message: "ID de joueur invalide" });
    }

    // Récupérer les notifications du joueur
    const notifications = await Notification.find({ playerId }).populate("playerId", "username email");
    if (!notifications.length) {
      return res.status(404).json({ message: "Aucune notification trouvée pour ce joueur" });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Erreur dans getNotificationByPlayerId :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des notifications", error: error.message });
  }
};

// Mettre à jour une notification (ex : marquer comme lue)
exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de notification invalide" });
    }

    // Mettre à jour la notification
    const notification = await Notification.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!notification) return res.status(404).json({ message: "Notification non trouvée" });

    res.status(200).json(notification);
  } catch (error) {
    console.error("Erreur dans updateNotification :", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la notification", error: error.message });
  }
};

// Supprimer une notification et l’enlever du joueur
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de notification invalide" });
    }

    // Supprimer la notification
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) return res.status(404).json({ message: "Notification non trouvée" });

    // Supprimer la notification de la liste du joueur
    await User.findByIdAndUpdate(notification.playerId, { $pull: { notifications: id } });

    res.status(200).json({ message: "Notification supprimée" });
  } catch (error) {
    console.error("Erreur dans deleteNotification :", error);
    res.status(500).json({ message: "Erreur lors de la suppression de la notification", error: error.message });
  }
};