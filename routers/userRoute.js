const User=require('./../models/userModel');
const express=require('express');
const authController=require('./../controllers/authController');
const userController=require('./../controllers/userController');

const Router=express.Router();

Router.route('/signup').post(authController.signup);
Router.route('/login').post(authController.login );
Router.route('/updateMe').patch(authController.protect,userController.upload.single('photo'),userController.resizePhoto,userController.updateMe)
Router.route('/users').get(authController.users);
module.exports=Router;
