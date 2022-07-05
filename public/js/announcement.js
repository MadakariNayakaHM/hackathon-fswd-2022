// import axios from 'axios';
// import mongoose from 'mongoose';

const announce= async (notification)=>
{
    try{
        const res =axios ({

            method:'POST',
            url:'http://127.0.0.1:5000/api/tyl-hackathon/notifications',
            data :{
                notification}
        })
    } catch (err){console.log(err)}
}
document.querySelector('.createAno').addEventListener('submit',e=>{
    e.preventDefault();
   const notification= document.getElementById('notification').value;
   
announce(notification)});





