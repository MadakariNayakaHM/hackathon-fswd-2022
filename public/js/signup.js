// import axios from 'axios';
// import mongoose from 'mongoose';

const signup= async (name,email,password,confirmPassword ,phoneNumber)=>
{
    try{
        const res =axios ({

            method:'POST',
            url:'http://127.0.0.1:5000/api/tyl-hackathon/user/signup',
            data :{
                name,email,password,confirmPassword,phoneNumber}
        })
    } catch (err){console.log(err)}
}
document.querySelector('.Signup').addEventListener('submit',e=>{
    e.preventDefault();
   const email= document.getElementById('email').value;
   const password= document.getElementById('password').value;
   const confirmPassword=document.getElementById('confirmPassword').value;
   const Name=document.getElementById('Name').value;
   const phoneNumber=document.getElementById('phoneNumber').value;
signup(Name,email,password,confirmPassword,phoneNumber)});





