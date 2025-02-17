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