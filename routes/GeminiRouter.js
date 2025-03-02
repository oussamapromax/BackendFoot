const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();
const fetch = require('node-fetch');

// Initialisation de l'API Google Generative AI
const genAI = new GoogleGenerativeAI("AIzaSyDIWnLhDMtxCT1Whvamp9llkNPZHP01Zk8"); //https://aistudio.google.com/apikey

// Route pour générer du texte avec Gemini
router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent(prompt);
    const response = result.response.text(); // Récupérer le texte généré

    res.json({ generatedText: response });

  } catch (error) {
    console.error("Erreur API Gemini :", error);
    res.status(500).json({ error: "Erreur lors de la génération du contenu." });
  }
});

module.exports = router;