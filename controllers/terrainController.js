const Terrain = require('../models/TerrainModel');
const upload = require('../middlewares/uploadFile');

exports.createTerrain = async (req, res) => {
    try {
        const { name, location, capacity, available } = req.body;
        const image = req.file ? req.file.path : null; // Chemin de l'image téléchargée
        const terrain = new Terrain({ name, location, capacity, available, image });
        await terrain.save();
        res.status(201).json(terrain);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Les autres méthodes (getTerrains, getTerrainById, updateTerrain, deleteTerrain) restent inchangées
exports.getTerrains = async (req, res) => {
    try {
        const terrains = await Terrain.find();
        res.status(200).json(terrains);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTerrainById = async (req, res) => {
    try {
        const terrain = await Terrain.findById(req.params.id);
        if (!terrain) return res.status(404).json({ error: 'Terrain not found' });
        res.status(200).json(terrain);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateTerrain = async (req, res) => {
    try {
        const terrain = await Terrain.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!terrain) return res.status(404).json({ error: 'Terrain not found' });
        res.status(200).json(terrain);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteTerrain = async (req, res) => {
    try {
        const terrain = await Terrain.findByIdAndDelete(req.params.id);
        if (!terrain) return res.status(404).json({ error: 'Terrain not found' });
        res.status(200).json({ message: 'Terrain deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Ajouter une disponibilité à un terrain
exports.ajouterDisponibilite = async (req, res) => {
    try {
        const { id } = req.params; // ID du terrain
        const { date, heureDebut, heureFin, estDisponible } = req.body;

        const terrain = await Terrain.findById(id);
        if (!terrain) return res.status(404).json({ message: 'Terrain not found' });

        terrain.disponibilites.push({ date, heureDebut, heureFin, estDisponible });
        await terrain.save();

        res.status(200).json({ message: 'Disponibilité ajoutée', terrain });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une disponibilité d'un terrain
exports.supprimerDisponibilite = async (req, res) => {
    try {
        const { id, disponibiliteId } = req.params; // ID du terrain et ID de la disponibilité

        const terrain = await Terrain.findById(id);
        if (!terrain) return res.status(404).json({ message: 'Terrain not found' });

        // Supprimer la disponibilité
        terrain.disponibilites = terrain.disponibilites.filter(
            dispo => dispo._id.toString() !== disponibiliteId
        );
        await terrain.save();

        res.status(200).json({ message: 'Disponibilité supprimée', terrain });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour le tarif horaire d'un terrain
exports.mettreAJourTarif = async (req, res) => {
    try {
        const { id } = req.params; // ID du terrain
        const { tarifHoraire } = req.body;

        const terrain = await Terrain.findByIdAndUpdate(
            id,
            { tarifHoraire },
            { new: true, runValidators: true }
        );
        if (!terrain) return res.status(404).json({ message: 'Terrain not found' });

        res.status(200).json({ message: 'Tarif horaire mis à jour', terrain });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir des statistiques sur les terrains
exports.statistique = async (req, res) => {
    try {
        const terrains = await Terrain.find();
        const totalTerrains = terrains.length;
        const totalCapacite = terrains.reduce((sum, terrain) => sum + terrain.capacity, 0);
        const tarifMoyen = terrains.reduce((sum, terrain) => sum + terrain.tarifHoraire, 0) / totalTerrains || 0;

        res.status(200).json({
            totalTerrains,
            totalCapacite,
            tarifMoyen: tarifMoyen.toFixed(2) // Arrondir à 2 décimales
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};