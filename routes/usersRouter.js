const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/uploadFile");
const { requireAuthUser } = require("../middlewares/authMiddleware");


// ✅ Inscription d'un utilisateur avec upload d'image
router.post("/sInscrire", upload.single("user_image"), userController.sInscrire);


// ✅ Mise à jour du profil avec upload d'image
router.post('/signup/image', upload.single('user_image'), userController.addClientUserWithImage);

// ✅ Connexion avec JWT
router.post("/login",userController.login);

// ✅ Déconnexion (clear JWT cookie)
router.post("/logout", userController.logout);

// Mettre à jour un utilisateur
router.put("/users/:id", userController.updateUserById);

// Supprimer un utilisateur
router.delete("/users/:id", userController.deleteUserById);

module.exports = router;