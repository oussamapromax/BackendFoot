const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    terrainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Terrain', required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
    date: { type: Date, default: Date.now }, // Date de l'avis
});

module.exports = mongoose.model('Avis', avisSchema);