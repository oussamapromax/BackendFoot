const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    terrainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Terrain', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true }, // Relation 1..1 avec Payment
});


module.exports = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
