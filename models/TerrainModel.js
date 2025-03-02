const mongoose = require('mongoose');
// definition de la taille du terrain 
const dimensionsStandards = {
    football: { longueur: 90, largeur: 45 }, // En mètres (minimum selon FIFA)
    basketball: { longueur: 28, largeur: 15 }, // Dimensions FIBA
    tennis: { longueur: 23.77, largeur: 8.23 } // Simple (double = 10.97m)
};
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
    disponibilites: { type: [disponibiliteSchema], default: [] }, // Liste des disponibilités
    type: { type: String, required: true , enum: ["football", "basketball", "tennis"]},
    ville: { type: String, required: true },
    dimensions: {
        longueur: { type: Number, required: true },
        largeur: { type: Number, required: true }
    },
    agenceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Agence', 
        required: true 
    }
});

module.exports = mongoose.model('Terrain', terrainSchema);