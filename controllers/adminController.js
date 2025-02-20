const mongoose = require("mongoose");
const Terrain = require("../models/TerrainModel");
const Reservation = require("../models/reservationModel");
const Payment = require("../models/PaymentModel");
const bcrypt = require("bcrypt");
const { User, Admin, Player } = require("../models/userSchema");

module.exports = {
  // **Gestion des utilisateurs (Admin & Player)**
  async gererUtilisateurs(req, res) {
    try {
      const { action, userId, data } = req.body;
      let user;

      switch (action) {
        case "create":
          try {
            const { username, email, password, role } = data;

            // Vérification manuelle du mot de passe
            const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!regexPassword.test(password)) {
              return res.status(400).json({
                message:
                  "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.",
              });
            }

            // Hachage du mot de passe après validation
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Création de l'utilisateur
            user = new User({ username, email, password: hashedPassword, role });
            await user.save();

            res.status(201).json({ message: "Utilisateur créé avec succès", user });
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
          break;

        case "update":
          if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID utilisateur invalide" });
          }

          if (data.password) {
            const userExist = await User.findById(userId);
            if (!userExist) throw new Error("Utilisateur non trouvé");

            // Vérifier si le mot de passe est déjà hashé
            const isSamePassword = await bcrypt.compare(data.password, userExist.password);
            if (!isSamePassword) {
              const salt = await bcrypt.genSalt(10);
              data.password = await bcrypt.hash(data.password, salt);
            } else {
              delete data.password; // Ne pas modifier le password s'il est inchangé
            }
          }

          user = await User.findByIdAndUpdate(userId, data, { new: true });
          if (!user) throw new Error("Utilisateur non trouvé");
          break;

        case "delete":
          if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID utilisateur invalide" });
          }
          user = await User.findByIdAndDelete(userId);
          if (!user) throw new Error("Utilisateur non trouvé");
          break;

        default:
          throw new Error("Action non valide");
      }

      res.status(200).json({ message: `Utilisateur ${action} avec succès`, user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // **Gestion des terrains**
  async gererTerrains(req, res) {
    try {
      const { action, terrainId, data } = req.body;
      let terrain;

      switch (action) {
        case "create":
          terrain = new Terrain(data);
          await terrain.save();
          break;

        case "update":
          if (!mongoose.Types.ObjectId.isValid(terrainId)) {
            return res.status(400).json({ message: "ID terrain invalide" });
          }
          terrain = await Terrain.findByIdAndUpdate(terrainId, data, { new: true });
          if (!terrain) throw new Error("Terrain non trouvé");
          break;

        case "delete":
          if (!mongoose.Types.ObjectId.isValid(terrainId)) {
            return res.status(400).json({ message: "ID terrain invalide" });
          }

          terrain = await Terrain.findById(terrainId);
          if (!terrain) {
            return res.status(404).json({ message: "Terrain non trouvé" });
          }

          try {
            await Terrain.findByIdAndDelete(terrainId);
            await Reservation.deleteMany({ terrainId });

            res.status(200).json({ message: "Terrain supprimé avec succès" });
          } catch (error) {
            res.status(500).json({ message: error.message });
          }

          break;

        default:
          throw new Error("Action non valide");
      }

      res.status(200).json({ message: `Terrain ${action} avec succès`, terrain });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // **Valider un paiement**
  async validerPaiement(req, res) {
    try {
      const { reservationId } = req.body;

      if (!mongoose.Types.ObjectId.isValid(reservationId)) {
        return res.status(400).json({ message: "ID réservation invalide" });
      }

      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
        return res.status(404).json({ message: "Réservation non trouvée" });
      }

      // Vérifier si le paiement est déjà validé
      if (reservation.statut === "confirmed") {
        return res.status(400).json({ message: "Le paiement est déjà validé" });
      }

      // Mettre à jour le statut de la réservation
      reservation.statut = "confirmed";
      await reservation.save();

      // Envoyer une notification au joueur
      const player = await Player.findById(reservation.playerId);
      if (player) {
        player.notifications.push({
          message: `Votre paiement pour la réservation ${reservation._id} a été validé.`,
          date: new Date(),
        });
        await player.save();
      }

      res.status(200).json({ message: "Paiement validé avec succès", reservation });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // **Envoyer une notification à un joueur**
  async envoyerNotification(req, res) {
    try {
      const { playerId, message } = req.body;

      if (!mongoose.Types.ObjectId.isValid(playerId)) {
        return res.status(400).json({ message: "ID joueur invalide" });
      }

      const player = await Player.findById(playerId);
      if (!player) {
        return res.status(404).json({ message: "Joueur non trouvé" });
      }

      // Ajouter la notification au joueur
      player.notifications.push({
        message,
        date: new Date(),
      });
      await player.save();

      res.status(200).json({ message: "Notification envoyée avec succès", player });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // **Consultation des statistiques**
  async consulterStatistiques(req, res) {
    try {
      const [totalUsers, totalAdmins, totalPlayers, totalTerrains, totalReservations] = await Promise.all([
        User.countDocuments(),
        Admin.countDocuments(),
        Player.countDocuments(),
        Terrain.countDocuments(),
        Reservation.countDocuments(),
      ]);

      res.status(200).json({ totalUsers, totalAdmins, totalPlayers, totalTerrains, totalReservations });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};