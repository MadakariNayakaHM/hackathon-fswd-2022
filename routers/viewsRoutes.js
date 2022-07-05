const viewController=require('./../controllers/viewsController');
const express= require('express');
const Router = express.Router();
Router.route('/base').get(viewController.basepug);
Router.route('/signup').get(viewController.signuppug);
Router.route('/login').get(viewController.loginpug);

Router.route('/projects').get( viewController.projectsUpdate)
Router.route('/notify').get(viewController.notification);
Router.route('/mentor').get(viewController.mentorpug);



module.exports=Router;