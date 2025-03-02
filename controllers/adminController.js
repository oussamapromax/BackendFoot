const mongoose = require("mongoose");
const User = require("../models/userSchema"); // ✅ Correction
const Agence = require("../models/AgenceModel");






module.exports = {
  // 🏢 Superviser une agence
  async superviserAgence(req, res) {
    try {
      const { adminId, agenceId } = req.body;

      // Vérifier si l'utilisateur est bien un admin
      const admin = await User.findOne({ _id: adminId, role: "Admin" });

      if (!admin) {
        return res.status(404).json({ message: "Admin non trouvé" });
      }

      // Vérifier si l'agence existe
      const agence = await Agence.findById(agenceId);
      if (!agence) {
        return res.status(404).json({ message: "Agence non trouvée" });
      }

      // Vérifier si l'admin a déjà supervisé cette agence
      if (!admin.agencesSupervisees) {
        admin.agencesSupervisees = [];
      }

      if (!admin.agencesSupervisees.includes(agenceId)) {
        admin.agencesSupervisees.push(agenceId);
        await admin.save();
      }

      // Retourner les informations sans les champs inutiles (Player, Admin)
      const adminData = {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        agencesSupervisees: admin.agencesSupervisees,
      };

      res.status(200).json({ message: "Agence supervisée avec succès", admin: adminData });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 📊 Consulter les statistiques globales
  async consulterStatistiques(req, res) {
    try {
      const [totalUsers, totalAdmins, totalPlayers, totalAgences] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "Admin" }),
        User.countDocuments({ role: "Player" }),
        Agence.countDocuments()
      ]);

      res.status(200).json({
        totalUsers,
        totalAdmins,
        totalPlayers,
        totalAgences
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

  

  