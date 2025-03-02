const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true }, // ✅ Optionnel mais unique
  email: { type: String, required: true, unique: true }, // ✅ Obligatoire et unique
  password: { type: String, required: true  }, // ✅ Obligatoire
  telephone: { type: String }, // ✅ Optionnel
  role: { type: String, required: true, enum: ["Player", "Admin"] }, // ✅ Obligatoire
  etat: { type: Boolean, default: true }, // ✅ Par défaut : true (actif)
  ban: { type: Boolean, default: false }, // ✅ Par défaut : false (non banni)
  user_image: { type: String }, // ✅ Optionnel
  agencesSupervisées: [{ type: mongoose.Schema.Types.ObjectId, ref: "Agence" }], // ✅ Optionnel
  reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reservation" }], // Réservations du joueur
  avis: [{ type: mongoose.Schema.Types.ObjectId, ref: "Avis" }], // Avis donnés par le joueur
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }], // Notifications du joueur
});


// Hash du mot de passe avant l'enregistrement
const argon2 = require("argon2");

userSchema.pre("save", async function (next) {
  const user = this;

  // Ne hacher le mot de passe que s'il est modifié ou nouveau
  if (user.isModified("password")) {
    try {
      user.password = await argon2.hash(user.password);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Méthode statique de connexion
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Utilisateur non trouvé.");
  }

  if (!user.password) {
    throw new Error("Erreur interne : aucun mot de passe stocké.");
  }

  const auth = await bcrypt.compare(password, user.password);
  console.log("Comparaison du mot de passe :", auth)
  if (!auth) {
    throw new Error("Mot de passe incorrect.");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);