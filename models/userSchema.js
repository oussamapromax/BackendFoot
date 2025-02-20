const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const options = { discriminatorKey: "role", timestamps: true };

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Veuillez entrer une adresse e-mail valide"],
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    user_image: { type: String, default: "client.png" },
    age: { type: Number },
    count: { type: Number, default: 0 },
  },
  options
);

// **Hash du mot de passe avant l'enregistrement**
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// **Méthode pour vérifier le mot de passe**
userSchema.methods.verifierMotDePasse = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// **Création du modèle principal**
const User = mongoose.model("User", userSchema);

// **Schéma spécifique au Player**
const playerSchema = new mongoose.Schema(
  {
    notifications: [
      {
        message: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  options
);

// **Ajout des méthodes au schéma du Player**
playerSchema.methods.giveAvis = async function (terrainId, rating, comment) {
  try {
      const avis = new Avis({
          playerId: this._id, // Utiliser l'ID du joueur actuel
          terrainId,
          rating,
          comment,
      });
      await avis.save();
      return avis;
  } catch (error) {
      throw new Error(error.message);
  }
};
playerSchema.methods.reserveTerrain = async function (terrainId, date, heureDebut, heureFin, montantTotal) {
  try {
    const terrain = await Terrain.findById(terrainId);
    if (!terrain) throw new Error("Terrain non trouvé");

    const reservation = new Reservation({
      playerId: this._id,
      terrainId,
      date,
      heureDebut,
      heureFin,
      montantTotal,
      statut: "pending",
    });
    await reservation.save();
    return reservation;
  } catch (error) {
    throw new Error(error.message);
  }
};

playerSchema.methods.payerReservation = async function (reservationId, montant, methode) {
  try {
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
          throw new Error("Réservation non trouvée");
      }

      if (montant < reservation.montantTotal) {
          throw new Error("Le montant payé est insuffisant");
      }

      const payment = new Payment({
          reservationId: reservation._id,
          montant,
          methode,
      });

      await payment.effectuerPaiement(); // Effectuer le paiement

      reservation.paymentId = payment._id;
      reservation.statut = "confirmed";
      await reservation.save();

      return payment;
  } catch (error) {
      throw new Error(error.message);
  }
};
// **Ajout du discriminator pour Player**
const Player = User.discriminator("player", playerSchema);

// **Ajout du discriminator pour Admin**
const Admin = User.discriminator(
  "admin",
  new mongoose.Schema(
    {
      permissions: { type: [String], default: ["manage_users", "manage_reservations"] },
    },
    options
  )
);
const Avis = require("./AvisModel");
const Reservation = require("./reservationModel");
const Terrain = require("./TerrainModel");
const Payment = require("./PaymentModel");
// Exportation des modèles
module.exports = { User, Player, Admin };