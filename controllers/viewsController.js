const user= require('./../models/userModel');
const project=require('./../models/projectModel');
const notifications= require('./../models/notificationModel');

const express= require('express');

exports.basepug=async(req,res)=>{
    const users = await user.find();
    res.status(200).render('base',{users});
}

exports.signuppug=async(req,res)=>{
    
    res.status(200).render('signup');
}

exports.loginpug=async(req,res)=>{
    
    res.status(200).render('login');
}

exports.projectsUpdate= async (req,res)=>
{
    const projects=await project.find();
    res.status(200).render('project',{projects});
}

exports.notification=async (req,res)=>
{
    const notify= await notifications.find();
    res.status(200).render('notification',{notify})
}

exports.mentorpug= async (req,res)=>{
    const User=user.find();
    res.status(200).render('mentor',{User});
}