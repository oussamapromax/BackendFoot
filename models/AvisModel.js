const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    terrainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Terrain', required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
    date: { type: Date, default: Date.now }, // Date de l'avis
});

module.exports = mongoose.model('Avis', avisSchema);