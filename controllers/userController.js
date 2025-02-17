const userModel = require('../models/userSchema');
const Player = require('../models/Player');
const Admin = require('../models/Admin');
const Avis = require('../models/AvisModel');
const Reservation = require('../models/ReservationModel');

module.exports.addUserClient = async (req,res) => {
    try {
        const {username , email , password , age} = req.body;
        const roleClient = 'client'
        // if (!checkIfUserExists) {
        //     throw new Error("User not found");
        //   }
        const user = await userModel.create({
            username,email ,password,role :roleClient, age
        })
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports.addUserClientWithImg = async (req,res) => {
    try {
        const {username , email , password } = req.body;
        const roleClient = 'client'
        const {filename} = req.file

        const user = await userModel.create({
            username,email ,password,role :roleClient , user_image : filename
        })
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


module.exports.addUserAdmin= async (req,res) => {
    try {
        const {username , email , password } = req.body;
        const roleAdmin = 'admin'
        const user = await userModel.create({
            username,email ,password,role :roleAdmin
        })
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports.sInscrire = async (req, res) => {
    try {
      const { username, email, password, age } = req.body;
      const user = new User({ username, email, password, age });
      await user.sInscrire();
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  module.exports.seConnecter = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');
  
      await user.seConnecter(password);
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  module.exports.modifierProfil = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) throw new Error('User not found');
  
      await user.modifierProfil(req.body);
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  module.exports.createAdmin = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const admin = new Admin({ username, email, password, role: 'admin' });
      await admin.sInscrire();
      res.status(200).json({ admin });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports.createPlayer = async (req, res) => {
    try {
        const { username, email, password, age } = req.body;
        const roleClient = 'client';
        const user = await User.create({
            username, email, password, role: roleClient, age
        });
        const player = new Player(user);
        res.status(200).json({ player });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.giveAvis = async (req, res) => {
    try {
        const { userId, terrainId, rating, comment } = req.body;
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const player = new Player(user);
        const avis = await player.giveAvis(terrainId, rating, comment);
        res.status(200).json({ avis });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.reserveTerrain = async (req, res) => {
    try {
        const { userId, terrainId, date } = req.body;
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const player = new Player(user);
        const reservation = await player.reserveTerrain(terrainId, date);
        res.status(200).json({ reservation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getAllUsers= async (req,res) => {
    try {
        const userListe = await userModel.find()

        res.status(200).json({userListe});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports.getUserById= async (req,res) => {
    try {
        //const id = req.params.id
        const {id} = req.params
        //console.log(req.params.id)
        const user = await userModel.findById(id)

        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports.deleteUserById= async (req,res) => {
    try {
        const {id} = req.params

        const checkIfUserExists = await userModel.findById(id);
        if (!checkIfUserExists) {
          throw new Error("User not found");
        }

        await userModel.findByIdAndDelete(id)

        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports.updateuserById = async (req, res) => {
try {
    const {id} = req.params
    const {email , username} = req.body;

    await userModel.findByIdAndUpdate(id,{$set : {email , username }})
    const updated = await userModel.findById(id)

    res.status(200).json({updated})
} catch (error) {
    res.status(500).json({message: error.message});
}
}

module.exports.searchUserByUsername = async (req, res) => {
    try {

        const { username } = req.query
        if(!username){
            throw new Error("Veuillez fournir un nom pour la recherche.");
        }

        const userListe = await userModel.find({
            username: {$regex: username , $options: "i"}
        })

        if (!userListe) {
            throw new Error("User not found");
          }
          const count = userListe.length
        res.status(200).json({userListe,count})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    }

    module.exports.getAllUsersSortByAge= async (req,res) => {
        try {
            const userListe = await userModel.find().sort({age : 1}).limit(2)
            //const userListe = await userModel.find().sort({age : -1}).limit(2)
    
            res.status(200).json({userListe});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
    
    module.exports.getAllUsersAge= async (req,res) => {
        try {
            const {age} = req.params
            const userListe = await userModel.find({ age : age})
    
            res.status(200).json({userListe});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    module.exports.getAllUsersAgeBetMaxAgeMinAge= async (req,res) => {
        try {
            const MaxAge = req.query.MaxAge
            const MinAge = req.query.MinAge
            const userListe = await userModel.find({age : { $gt : MinAge , $lt : MaxAge}}).sort({age : 1})
    
            res.status(200).json({userListe});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    module.exports.getAllClient= async (req,res) => {
        try {

            const userListe = await userModel.find({role : "client"})
    
            res.status(200).json({userListe});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    module.exports.getAllAdmin= async (req,res) => {
        try {

            const userListe = await userModel.find({role : "admin"})
    
            res.status(200).json({userListe});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
