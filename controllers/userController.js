const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User, Player, Admin } = require("../models/userSchema");



module.exports.addUserClient = async (req, res) => {
    try {
        const { username, email, password, age } = req.body;
        const roleClient = 'client';
        const user = await User.create({
            username, email, password, role: roleClient, age
        });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.addUserClientWithImg = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const roleClient = 'client';
        const { filename } = req.file;

        const user = await User.create({
            username, email, password, role: roleClient, user_image: filename
        });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.addUserAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const roleAdmin = 'admin';
        const user = await User.create({
            username, email, password, role: roleAdmin
        });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.sInscrire = async (req, res) => {
    try {
      const { username, email, password, age, role } = req.body;
  
      // Vérification si l'email existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }
  
      // Déterminer le type d'utilisateur (Player ou Admin)
      let newUser;
      if (role === "admin") {
        newUser = new Admin({ username, email, password, age });
      } else {
        newUser = new Player({ username, email, password, age });
      }
  
      // Sauvegarde de l'utilisateur
      await newUser.save();
      res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });
  
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      res.status(500).json({ message: error.message });
    }
  };

module.exports.seConnecter = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');
  
      // Utilise la méthode verifierMotDePasse pour comparer le mot de passe
      const isMatch = await user.verifierMotDePasse(password);
      if (!isMatch) throw new Error("Mot de passe invalide");
  
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
   
  module.exports.modifierProfil = async (req, res) => {
    try {
      const { id } = req.params; // Récupération de l'ID
      const { username, email, age, password, user_image } = req.body;
  
      // Vérification de l'ID valide
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID utilisateur invalide." });
      }
  
      let user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
  
      // Création d'un objet de mise à jour
      let updateFields = {};
      if (username) updateFields.username = username;
      if (email) updateFields.email = email;
      if (age) updateFields.age = age;
      if (user_image) updateFields.user_image = user_image;
  
      // Hachage du mot de passe seulement s'il est fourni
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateFields.password = await bcrypt.hash(password, salt);
      }
  
      // Mettre à jour sans revalider le password haché
      const updatedUser = await User.findByIdAndUpdate(id, updateFields, { 
        new: true, 
        runValidators: false // Empêche la validation du mot de passe déjà haché
      });
  
      res.status(200).json({ message: "Utilisateur mis à jour avec succès", user: updatedUser });
  
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
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
        const user = await User.create({ // Utilisez User ici
            username, email, password, role: roleClient, age
        });
        const player = new Player(user);
        res.status(200).json({ player });
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



    // Ajouter un joueur
    const createPlayer = async (req, res) => {
      try {
        const player = new Player(req.body);
        await player.save();
        res.status(201).json(player);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
    
    // Ajouter un admin
    const createAdmin = async (req, res) => {
      try {
        const admin = new Admin(req.body);
        await admin.save();
        res.status(201).json(admin);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
    