const mongoose = require('mongoose');

const terrainSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    available: { type: Boolean, default: true },
    image: { type: String } // Chemin de l'image
});

module.exports = mongoose.model('Terrain', terrainSchema);