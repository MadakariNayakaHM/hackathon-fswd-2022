const notController= require('./../controllers/notificationController');
const authController=require('./../controllers/authController');
const express= require('express');

const Router=express.Router();
Router.route('/notifications').post(notController.createNotification).get(notController.getAllnotifications);
Router.route('/notifications/:id').patch(notController.updateNotifications).delete(notController.updateNotifications);
module.exports=Router;