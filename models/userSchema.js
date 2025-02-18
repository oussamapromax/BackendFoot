const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const options = { discriminatorKey: "role", timestamps: true }; // Ajout du champ de discrimination

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
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
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.",
      ],
    },
    user_image: { type: String, default: "client.png" },
    age: { type: Number },
    count: { type: Number, default: 0 },
  },
  options
);

// **Hash du mot de passe avant l'enregistrement**
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Ne hache que si le mot de passe est modifié
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

// **Post-save middleware pour log**
userSchema.post("save", function () {
  console.log(`Nouvel utilisateur créé : ${this.username}`);
});

const User = mongoose.model("User", userSchema);
module.exports = User;
