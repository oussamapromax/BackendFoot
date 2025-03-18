const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const maxTime = 24 * 60 * 60; // 24H
const createToken = (id) => jwt.sign({ id }, "net secret pfe", { expiresIn: maxTime });

// Fonction utilitaire pour hacher le mot de passe
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10); // Générer un salt avec un coût de 10
    return await bcrypt.hash(password, salt); // Hacher le mot de passe avec le salt
  } catch (error) {
    throw new Error("Erreur lors du hachage du mot de passe.");
  }
};

module.exports = {
  sInscrire: async (req, res) => {
    try {
      const { username, email, password, telephone, role } = req.body;

      // Vérification si l'email existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Cet email est déjà utilisé." });
      }

      // Vérification du rôle
      if (!["Player", "Admin"].includes(role)) {
        return res.status(400).json({ message: "Rôle invalide." });
      }

      // Vérification si le username existe déjà
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Ce username est déjà utilisé." });
      }

      // ✅ Empêcher un utilisateur normal de s'inscrire en tant qu'Admin
      if (role === "Admin" && (!req.user || req.user.role !== "Admin")) {
        return res.status(403).json({ message: "Seuls les administrateurs peuvent créer un compte Admin." });
      }

      // Hachage du mot de passe
      const hashedPassword = await hashPassword(password);

      const newUser = new User({
        email,
        username,
        password: hashedPassword,
        telephone,
        role,
        user_image: req.file ? `/files/${req.file.filename}` : null,
      });

      await newUser.save();
      res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });
    } catch (error) {
      console.error("Erreur dans sInscrire :", error);
      res.status(500).json({ message: "Erreur lors de l'inscription." });
    }
  },

  updateUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, password, telephone, role } = req.body;

      // Vérifier si l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID utilisateur invalide." });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      // ✅ Vérification des permissions
      if (req.user.role !== "Admin" && req.user._id.toString() !== id) {
        return res.status(403).json({ message: "Accès interdit, vous ne pouvez modifier que votre propre profil" });
      }

      // Mise à jour des champs (seulement s'ils sont fournis)
      if (username) user.username = username;
      if (email) user.email = email;
      if (telephone) user.telephone = telephone;
      if (role) user.role = role;

      // Mise à jour du mot de passe (seulement s'il est fourni)
      if (password) {
        user.password = await hashPassword(password);
      }

      // Mise à jour de l'image de profil (si fournie)
      if (req.file) {
        if (user.user_image) {
          const oldImagePath = path.join(__dirname, "..", "public", "uploads", user.user_image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        user.user_image = `/uploads/${req.file.filename}`;
      }

      await user.save();
      res.status(200).json({ message: "Profil mis à jour avec succès", user });
    } catch (error) {
      console.error("Erreur dans updateUserById :", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour du profil: " + error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Vérification si l'utilisateur existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }


      // Génération du token JWT
      const token = createToken(user._id);

      // Réponse en cas de succès
      res.cookie("jwt_token_9antra", token, { httpOnly: false, maxAge: maxTime * 1000 });
      res.status(200).json({
        message: "Connexion réussie",
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          telephone: user.telephone,
          role: user.role,
          user_image: user.user_image,
        },
        token: token, // Ajoutez le token ici
      });
    } catch (error) {
      console.error("Erreur dans login :", error);
      res.status(500).json({ message: "Erreur lors de la connexion." });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("jwt_token_9antra");
      res.status(200).json({ message: "Déconnexion réussie." });
    } catch (error) {
      console.error("Erreur dans logout :", error);
      res.status(500).json({ message: "Erreur lors de la déconnexion." });
    }
  },

  addClientUserWithImage: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const roleClient = "Player";
      const { filename } = req.file;

      // Hachage du mot de passe
      const hashedPassword = await hashPassword(password);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: roleClient,
        user_image: filename,
      });

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteUserById: async (req, res) => {
    try {
      const { id } = req.params;

      // Vérifier si l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID utilisateur invalide." });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
      //get users
    

      // Supprimer l'utilisateur
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      console.error("Erreur dans deleteUserById :", error);
      res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur." });
    }
  },
  getAllUsers : async (req,res) => {
    try {
        const userListe = await User.find()
        res.status(200).json({userListe});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
};