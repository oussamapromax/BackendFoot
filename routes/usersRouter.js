var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/uploadFile');
/* GET users listing. */
router.post('/addUserClient',userController.addUserClient); 
router.post('/addUserAdmin',userController.addUserAdmin); 
router.get('/getAllUsers',userController.getAllUsers); 
router.get('/getUserById/:id',userController.getUserById); 
router.get('/searchUserByUsername',userController.searchUserByUsername); 
router.get('/getAllUsersAge/:age',userController.getAllUsersAge); 
router.get('/getAllUsersSortByAge',userController.getAllUsersSortByAge); 
router.get('/getAllClient',userController.getAllClient); 
router.get('/getAllAdmin',userController.getAllAdmin); 
router.get('/getAllUsersAgeBetMaxAgeMinAge',userController.getAllUsersAgeBetMaxAgeMinAge); 
router.put('/updateuserById/:id',userController.updateuserById); 

router.post('/addUserClientWithImg',upload.single("image_user"),userController.addUserClientWithImg); 
router.post('/inscrire', userController.sInscrire);
router.post('/connecter', userController.seConnecter);
router.put('/modifier-profil/:id', userController.modifierProfil);
router.post('/admin', userController.createAdmin);
router.post('/player', userController.createPlayer);
router.post('/give-avis', userController.giveAvis);
router.post('/reserve-terrain', userController.reserveTerrain);

module.exports = router;
