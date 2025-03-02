const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    terrainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Terrain', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Avis', avisSchema);