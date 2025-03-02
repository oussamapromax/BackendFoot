const mongoose = require("mongoose");
const Reservation = require("../models/reservationModel");
const Payment = require("../models/PaymentModel");
const Terrain = require("../models/TerrainModel");
const User = require("../models/userSchema");
const Agence = require("../models/AgenceModel"); 
// Créer une réservation avec paiement
exports.createReservation = async (req, res) => {
  try {
    console.log("Requête reçue :", req.body); // DEBUG : Vérifier les données reçues
    const { playerId, terrainId, date, heureDebut, heureFin, montantTotal, agenceId } = req.body;

    // Vérifier si les IDs sont valides
    if (
      !mongoose.Types.ObjectId.isValid(playerId) ||
      !mongoose.Types.ObjectId.isValid(terrainId) ||
      !mongoose.Types.ObjectId.isValid(agenceId)
    ) {
      return res.status(400).json({ message: "ID invalide pour le joueur, le terrain ou l'agence" });
    }

    // Vérifier l'existence du joueur, du terrain et de l'agence
    const player = await User.findOne({ _id: playerId, role: "Player" });
    if (!player) return res.status(404).json({ message: "Joueur non trouvé ou rôle invalide" });

    const terrain = await Terrain.findById(terrainId);
    if (!terrain) return res.status(404).json({ message: "Terrain non trouvé" });

    const agence = await Agence.findById(agenceId); // Si vous avez un modèle Agence
    if (!agence) return res.status(404).json({ message: "Agence non trouvée" });

    // Créer la réservation
    const reservation = new Reservation({
      playerId,
      terrainId,
      date,
      heureDebut,
      heureFin,
      montantTotal,
      agenceId,
      statut: "pending",
    });

    await reservation.save(); // Sauvegarder pour obtenir reservation._id

    // Créer le paiement en associant la réservation
    const payment = new Payment({
      montant: montantTotal,
      methode: "carte",
      statut: "pending",
      agenceId,
      reservationId: reservation._id, // Associer la réservation ici
    });

    await payment.save();

    // Mettre à jour la réservation avec paymentId
    reservation.paymentId = payment._id;
    await reservation.save();

    res.status(201).json({ message: "Réservation créée avec succès", reservation, payment });
  } catch (error) {
    console.error("Erreur dans createReservation :", error);
    res.status(500).json({ message: "Erreur lors de la création de la réservation", error: error.message });
  }
};

// Récupérer toutes les réservations
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("playerId", "username email") // Afficher le champ 'username' du Player
      .populate("terrainId", "name location");

    res.status(200).json(reservations);
  } catch (error) {
    console.error("Erreur dans getReservations :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des réservations", error: error.message });
  }
};

// Récupérer une réservation par ID
exports.getReservationById = async (req, res) => {
  try {
    // Vérifiez que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de réservation invalide" });
    }

    // Récupérez la réservation avec les informations du joueur et du terrain
    const reservation = await Reservation.findById(req.params.id)
      .populate("playerId", "username email") // Sélectionnez les champs à afficher pour le joueur
      .populate("terrainId", "name location capacity"); // Sélectionnez les champs à afficher pour le terrain

    // Vérifiez si la réservation existe
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Renvoyez la réservation avec les informations du joueur et du terrain
    res.status(200).json(reservation);
  } catch (error) {
    console.error("Erreur dans getReservationById :", error);
    res.status(500).json({ message: "Erreur lors de la récupération de la réservation", error: error.message });
  }
};

// Récupérer les réservations d'un joueur spécifique
exports.getReservationsByPlayerId = async (req, res) => {
  try {
    const { playerId } = req.params;

    const reservations = await Reservation.find({ playerId })
      .populate("terrainId", "name location");

    res.status(200).json(reservations);
  } catch (error) {
    console.error("Erreur dans getReservationsByPlayerId :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des réservations", error: error.message });
  }
};

// Annuler une réservation
exports.annulerReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { statut: "cancelled" },
      { new: true }
    );

    if (!reservation) return res.status(404).json({ message: "Réservation non trouvée" });

    res.status(200).json({ message: "Réservation annulée", reservation });
  } catch (error) {
    console.error("Erreur dans annulerReservation :", error);
    res.status(500).json({ message: "Erreur lors de l'annulation de la réservation", error: error.message });
  }
};

// Confirmer une réservation
exports.confirmerReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { statut: "confirmed" },
      { new: true }
    );

    if (!reservation) return res.status(404).json({ message: "Réservation non trouvée" });

    res.status(200).json({ message: "Réservation confirmée", reservation });
  } catch (error) {
    console.error("Erreur dans confirmerReservation :", error);
    res.status(500).json({ message: "Erreur lors de la confirmation de la réservation", error: error.message });
  }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Réservation non trouvée" });

    res.status(200).json({ message: "Réservation supprimée" });
  } catch (error) {
    console.error("Erreur dans deleteReservation :", error);
    res.status(500).json({ message: "Erreur lors de la suppression de la réservation", error: error.message });
  }
};

// Mettre à jour une réservation
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReservation = await Reservation.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedReservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error("Erreur dans updateReservation :", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la réservation", error: error.message });
  }
};