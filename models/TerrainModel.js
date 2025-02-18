const mongoose = require('mongoose');

// Définition du schéma de disponibilité
const disponibiliteSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    heureDebut: { type: String, required: true }, // Format "HH:MM"
    heureFin: { type: String, required: true },   // Format "HH:MM"
    estDisponible: { type: Boolean, default: true }
});

// Définition du schéma du terrain
const terrainSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    available: { type: Boolean, default: true },
    image: { type: String }, // Chemin de l'image
    equipements: { type: [String], default: [] }, // Liste des équipements
    tarifHoraire: { type: Number, default: 0 },  // Tarif horaire
    disponibilites: { type: [disponibiliteSchema], default: [] } // Liste des disponibilités
});

module.exports = mongoose.model('Terrain', terrainSchema);
