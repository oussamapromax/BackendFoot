const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  });
  
  const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;