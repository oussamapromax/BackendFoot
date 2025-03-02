const User = require("../models/userSchema");
const Terrain = require("../models/TerrainModel");
const Reservation = require("../models/reservationModel");
const Avis = require("../models/AvisModel");
const Payment = require("../models/PaymentModel");
const mongoose = require("mongoose");

module.exports = {
  // ✅ Réserver un terrain
  chercherTerrain: async (req, res) => {
    try {
        const { ville, type, date, heureDebut, heureFin , dimensions } = req.query;

        // Construire le filtre de recherche
        let filtre = {};
        if (ville) filtre.ville = ville;
        if (type) filtre.type = type;
        if (dimensions) filtre.type = dimensions;

        // Trouver les terrains correspondant aux critères
        const terrains = await Terrain.find(filtre);

        if (!terrains.length) {
            return res.status(404).json({ message: "Aucun terrain trouvé pour ces critères." });
        }

        // Vérifier la disponibilité des terrains
        const terrainsDisponibles = [];

        for (const terrain of terrains) {
            const reservationExistante = await Reservation.findOne({
                terrainId: terrain._id,
                date,
                $or: [
                    { heureDebut: { $lt: heureFin }, heureFin: { $gt: heureDebut } },
                ],
            });

            if (!reservationExistante) {
                terrainsDisponibles.push(terrain);
            }
        }

        if (!terrainsDisponibles.length) {
            return res.status(400).json({ message: "Aucun terrain disponible à cette date et heure." });
        }

        res.status(200).json({ message: "Terrains disponibles trouvés", terrains: terrainsDisponibles });

    } catch (error) {
        console.error("Erreur dans chercherTerrain :", error);
        res.status(500).json({ message: "Erreur lors de la recherche de terrains", error: error.message });
    }
},

  // ✅ Donner un avis
  donnerAvis: async (req, res) => {
    try {
      const { playerId, terrainId, rating, comment } = req.body;

      // Vérifier si les IDs sont valides
      if (!mongoose.Types.ObjectId.isValid(playerId) || !mongoose.Types.ObjectId.isValid(terrainId)) {
        return res.status(400).json({ message: "ID de joueur ou de terrain invalide" });
      }

      // Vérifier l'existence du joueur et du terrain
      const player = await User.findOne({ _id: playerId, role: "Player" });
      if (!player) return res.status(404).json({ message: "Joueur non trouvé ou rôle invalide" });

      const terrain = await Terrain.findById(terrainId);
      if (!terrain) return res.status(404).json({ message: "Terrain non trouvé" });

      // Créer l'avis
      const avis = new Avis({ playerId, terrainId, rating, comment });
      await avis.save();

      res.status(201).json({ message: "Avis ajouté avec succès", avis });
    } catch (error) {
      console.error("Erreur dans donnerAvis :", error);
      res.status(500).json({ message: "Erreur lors de l'ajout de l'avis", error: error.message });
    }
  },

  // ✅ Payer une réservation
  payerReservation: async (req, res) => {
    try {
      const { reservationId, montant, methode } = req.body;

      // Vérifier si l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(reservationId)) {
        return res.status(400).json({ message: "ID de réservation invalide" });
      }

      // Vérifier l'existence de la réservation
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) return res.status(404).json({ message: "Réservation non trouvée" });

      // Vérifier le montant du paiement
      if (montant !== reservation.montantTotal) {
        return res.status(400).json({ message: "Le montant du paiement ne correspond pas au montant total de la réservation" });
      }

      // Créer le paiement
      const payment = new Payment({ reservationId, montant, methode });
      await payment.save();

      // Mettre à jour le statut de la réservation
      reservation.statut = "confirmed";
      await reservation.save();

      res.status(201).json({ message: "Paiement effectué avec succès", payment });
    } catch (error) {
      console.error("Erreur dans payerReservation :", error);
      res.status(500).json({ message: "Erreur lors du paiement", error: error.message });
    }
  },
};