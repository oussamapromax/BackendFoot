const mongoose = require("mongoose");
const Terrain = require("../models/TerrainModel");




// Créer un terrain avec gestion d'image
exports.createTerrain = async (req, res) => {
    try {
        console.log("req.body:", req.body);
        console.log("req.file:", req.file);

        // Récupération des données du corps de la requête
        const { name, location, capacity, available, agenceId,type,ville,tarifHoraire , dimensions } = req.body;

        if (!name || !location || !capacity || available === undefined || !agenceId || !type || !ville || !tarifHoraire || !dimensions) {
            return res.status(400).json({ error: "Tous les champs sont requis." });
        }
        // Création du terrain
        const terrain = new Terrain({
            name,
            location,
            capacity,
            available,
            image: req.file ? `/uploads/${req.file.filename}` : null,
            agenceId,
            type,
            ville,
            tarifHoraire,
            dimensions,
        });
 
        // Sauvegarde en base de données
        await terrain.save();

        res.status(201).json({ message: "Terrain créé avec succès", terrain });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer tous les terrains
exports.getTerrains = async (req, res) => {
    try {
        const terrains = await Terrain.find();
        res.status(200).json(terrains);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Récupérer un terrain par ID
exports.getTerrainById = async (req, res) => {
    try {
        const terrain = await Terrain.findById(req.params.id);
        if (!terrain) return res.status(404).json({ error: 'Terrain non trouvé' });
        res.status(200).json(terrain);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Mettre à jour un terrain
exports.updateTerrain = async (req, res) => {
    try {
        const terrain = await Terrain.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!terrain) return res.status(404).json({ error: 'Terrain non trouvé' });
        res.status(200).json(terrain);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer un terrain
exports.deleteTerrain = async (req, res) => {
    try {
        const terrain = await Terrain.findByIdAndDelete(req.params.id);
        if (!terrain) return res.status(404).json({ error: 'Terrain non trouvé' });
        res.status(200).json({ message: 'Terrain supprimé' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Ajouter une disponibilité à un terrain
exports.ajouterDisponibilite = async (req, res) => {
    try {
        const { id } = req.params; // ID du terrain
        const { date, heureDebut, heureFin, estDisponible } = req.body;

        // Convertir la date au format JJ/MM/AAAA en objet Date
        const [day, month, year] = date.split("/");
        const isoDateString = `${year}-${month}-${day}`;
        const dateObject = new Date(isoDateString);

        // Vérifier si la conversion a réussi
        if (isNaN(dateObject.getTime())) {
            return res.status(400).json({ message: "Format de date invalide. Utilisez JJ/MM/AAAA." });
        }

        // Trouver le terrain
        const terrain = await Terrain.findById(id);
        if (!terrain) return res.status(404).json({ message: 'Terrain non trouvé' });

        // Ajouter la disponibilité
        terrain.disponibilites.push({
            date: dateObject,
            heureDebut,
            heureFin,
            estDisponible,
        });

        // Sauvegarder les modifications
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
        if (!terrain) return res.status(404).json({ message: 'Terrain non trouvé' });

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
        if (!terrain) return res.status(404).json({ message: 'Terrain non trouvé' });

        res.status(200).json({ message: 'Tarif horaire mis à jour', terrain });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

