const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    playerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Player', 
        required: true 
    },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'alerte', 'confirmation'], required: true },
    read: { type: Boolean, default: false }, // Notification non lue par défaut
    createdAt: { type: Date, default: Date.now }
});

// Méthode pour envoyer une notification
notificationSchema.methods.envoyerNotification = function () {
    console.log(`Notification envoyée à ${this.playerId}: ${this.message}`);
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
