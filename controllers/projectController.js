const project= require('./../models/projectModel');
const User= require('./../models/userModel');
const multer = require('multer');
const sharp = require('sharp');
const jwt=require('jsonwebtoken');

const multerStorage = multer.memoryStorage();
 
const multerFilter=(req,file,cb)=>
{
  if(file.mimetype.startsWith('image'))
  {
    cb(null,true)

  }
  else
  {
cb(res.status(404).json({status:'fail',message:'upload images only'}),false);
  }
}

exports.upload=multer({
  storage:multerStorage,
  fileFilter: multerFilter
  
})
exports.resizePhoto =async (req,res,next)=>{
  if(!req.file){return next()}
  const token = req.cookies.jwt;
  const decoded= jwt.verify(token, process.env.JWT_SECRET,(err,decoded)=>{return decoded.id})
  req.file.filename=`user-${decoded}-${Date.now()}.jpeg`
  console.log(req.file)
  await sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/users/${req.file.filename}`)
  next();
}


exports.createProject= async (req,res,next)=>
{
    
    const newProject= await project.create(req.body);
    res.status(200).json({status:"success",
       project: newProject});
       next()

}

exports.getAllProjects = async (req,res,next)=>
{
    const projects= await project.find();
    res.status(200).json({status:"success",
    projects:projects});
    next()
}
exports.updateProject = async (req,res,next)=>{
const updatedProject=await project.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
res.status(201).json({status:"success",
data:updatedProject});
next()
}

exports.deleteProject= async (req,res,next)=>
{
   await project.findByIdAndDelete(req.body.delete);
    res.status(204).json({status:"success",
    data:null})
    next()
}