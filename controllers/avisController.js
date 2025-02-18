const Avis = require('../models/AvisModel');
const Player = require('../models/Player');
const Terrain = require('../models/TerrainModel');

// Ajouter un avis (CREATE)
exports.ajouterAvis = async (req, res) => {
    try {
        const { playerId, terrainId, rating, comment } = req.body;

        // Vérifier si le joueur et le terrain existent
        const player = await Player.findById(playerId);
        if (!player) return res.status(404).json({ message: 'Joueur non trouvé' });

        const terrain = await Terrain.findById(terrainId);
        if (!terrain) return res.status(404).json({ message: 'Terrain non trouvé' });

        // Créer l'avis
        const avis = new Avis({
            playerId,
            terrainId,
            rating,
            comment,
        });

        await avis.save();
        res.status(201).json({ message: 'Avis ajouté', avis });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer tous les avis (READ)
exports.getAvis = async (req, res) => {
    try {
        const avis = await Avis.find()
            .populate('playerId', 'name') // Afficher le nom du joueur
            .populate('terrainId', 'name location'); // Afficher le nom et l'emplacement du terrain

        res.status(200).json(avis);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Récupérer un avis spécifique par ID (READ)
exports.getAvisById = async (req, res) => {
    try {
        const avis = await Avis.findById(req.params.id)
            .populate('playerId', 'name')
            .populate('terrainId', 'name location');

        if (!avis) return res.status(404).json({ message: 'Avis non trouvé' });

        res.status(200).json(avis);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Modifier un avis (UPDATE)
exports.modifierAvis = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        const avis = await Avis.findByIdAndUpdate(
            id,
            { rating, comment },
            { new: true, runValidators: true }
        );

        if (!avis) return res.status(404).json({ message: 'Avis non trouvé' });

        res.status(200).json({ message: 'Avis modifié', avis });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer un avis (DELETE)
exports.supprimerAvis = async (req, res) => {
    try {
        const { id } = req.params;

        const avis = await Avis.findByIdAndDelete(id);
        if (!avis) return res.status(404).json({ message: 'Avis non trouvé' });

        res.status(200).json({ message: 'Avis supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer les avis d'un joueur spécifique
exports.getAvisByPlayerId = async (req, res) => {
    try {
        const { playerId } = req.params;

        const avis = await Avis.find({ playerId })
            .populate('terrainId', 'name location');

        res.status(200).json(avis);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Récupérer les avis d'un terrain spécifique
exports.getAvisByTerrainId = async (req, res) => {
    try {
        const { terrainId } = req.params;

        const avis = await Avis.find({ terrainId })
            .populate('playerId', 'name');

        res.status(200).json(avis);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
