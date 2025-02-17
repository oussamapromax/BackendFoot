const Avis = require('../models/AvisModel');

exports.createAvis = async (req, res) => {
    try {
        const avis = new Avis(req.body);
        await avis.save();
        res.status(201).json(avis);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAvis = async (req, res) => {
    try {
        const avis = await Avis.find().populate('userId terrainId');
        res.status(200).json(avis);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAvisById = async (req, res) => {
    try {
        const avis = await Avis.findById(req.params.id).populate('userId terrainId');
        if (!avis) return res.status(404).json({ error: 'Avis not found' });
        res.status(200).json(avis);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateAvis = async (req, res) => {
    try {
        const avis = await Avis.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!avis) return res.status(404).json({ error: 'Avis not found' });
        res.status(200).json(avis);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteAvis = async (req, res) => {
    try {
        const avis = await Avis.findByIdAndDelete(req.params.id);
        if (!avis) return res.status(404).json({ error: 'Avis not found' });
        res.status(200).json({ message: 'Avis deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};