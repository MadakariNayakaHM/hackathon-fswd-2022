const project= require('./../models/projectModel');
const express=require('express');
const authController=require('./../controllers/authController');
const projectController= require('./../controllers/projectController');
const Router=express.Router();
Router.route('/projects').get(projectController.getAllProjects).post(projectController.createProject );
Router.route('/projects/:id').patch(projectController.updateProject,authController.ristrictTo('evaluator','mentor')).delete(projectController.deleteProject,authController.ristrictTo('evaluator'));
module.exports=Router;