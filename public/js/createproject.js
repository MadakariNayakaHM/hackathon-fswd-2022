// import axios from 'axios';
// import mongoose from 'mongoose';

const createProject= async (projectName,members,mentor,grade,protoType)=>
{
    try{
        const res =axios ({

            method:'POST',
            url:'http://127.0.0.1:5000/api/tyl-hackathon/projects',
            data :{
                projectName,members,mentor,grade,protoType}
        })
    } catch (err){console.log(err)}
}
document.querySelector('.create').addEventListener('submit',e=>{
    e.preventDefault();
   const projectName= document.getElementById('projectName').value;
   const members= document.getElementById('members').value;
   const mentor=document.getElementById('mentor').value;
   const grade=document.getElementById('grade').value;
   const protoType=document.getElementById('protoType').value;
   createProject(projectName,members,mentor,grade,protoType)});





