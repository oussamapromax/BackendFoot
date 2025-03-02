const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const requireAuthUser = (req, res, next) => {
  const token = req.cookies.jwt_token_9antra;

  // Si le token existe
  if (token) {
    jwt.verify(token, 'net secret pfe', async (err, decodedToken) => {
      if (err) {
        console.log("Erreur au niveau du token", err.message);
        res.status(403).json({ message: "Problème avec le token" });
      } else {
        // Si le token est valide, on récupère l'utilisateur
        const user = await User.findById(decodedToken.id);
        if (!user) {
          return res.status(401).json({ message: "Utilisateur non trouvé." });
        }
        req.user = user; // Ajouter l'utilisateur à la requête
        next();  // Passe à la fonction suivante
      }
    });
  } else {
    res.status(401).json({ message: "Pas de token, accès interdit" });
  }
};

// ✅ Middleware pour vérifier si l'utilisateur est Admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentification requise" });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Accès refusé : Admin uniquement" });
  }

  next(); // L'utilisateur est Admin, continuer
};

module.exports = { requireAuthUser, isAdmin };