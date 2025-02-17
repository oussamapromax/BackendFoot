const mongoose = require('mongoose');
const User = require('./userSchema');

const playerSchema = new mongoose.Schema({
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
});

// Éviter la redéclaration du modèle
const PlayerModel = User.discriminator('Player', playerSchema);

class Player extends PlayerModel {
    constructor(userData) {
        super(userData); // Appelle le constructeur de la classe parente
    }

    async giveAvis(terrainId, rating, comment) {
        try {
            const avis = new mongoose.models.Avis({
                userId: this._id,
                terrainId,
                rating,
                comment
            });
            await avis.save();
            return avis;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async reserveTerrain(terrainId, date) {
        try {
            const reservation = new mongoose.models.Reservation({
                userId: this._id,
                terrainId,
                date,
                status: 'pending'
            });
            await reservation.save();
            return reservation;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = PlayerModel;
