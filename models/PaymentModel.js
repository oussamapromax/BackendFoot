const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true, unique: true }, // Relation 1..1 avec Reservation
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
  });
module.exports = mongoose.model('Payment', paymentSchema);