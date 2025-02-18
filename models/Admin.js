const User = require('./userSchema');
const Terrain = require('./TerrainModel'); // Importation du modèle Terrain
const Reservation = require('./reservationModel'); // Importation du modèle Reservation

class Admin extends User {
  constructor(userData) {
    super(userData);
  }

  async gererUtilisateurs(action, userId, data) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      switch (action) {
        case 'update':
          Object.assign(user, data);
          await user.save();
          break;
        case 'delete':
          await User.findByIdAndDelete(userId);
          break;
        default:
          throw new Error('Invalid action');
      }
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async gererTerrains(action, terrainId, data) {
    try {
      const terrain = await Terrain.findById(terrainId);
      if (!terrain) throw new Error('Terrain not found');

      switch (action) {
        case 'update':
          Object.assign(terrain, data);
          await terrain.save();
          break;
        case 'delete':
          await Terrain.findByIdAndDelete(terrainId);
          break;
        default:
          throw new Error('Invalid action');
      }
      return terrain;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async consulterStatistiques() {
    try {
      const usersCount = await User.countDocuments();
      const terrainsCount = await Terrain.countDocuments();
      const reservationsCount = await Reservation.countDocuments();

      return { usersCount, terrainsCount, reservationsCount };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = Admin;