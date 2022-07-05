// User=require('./../models/userModel');
const multer = require('multer');
const sharp = require('sharp');
const jwt=require('jsonwebtoken');
const User = require('./../models/userModel');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     const token = req.cookies.jwt;
//     const decoded= jwt.verify(token, process.env.JWT_SECRET,(err,decoded)=>{return decoded.id})
//     cb(null, `user-${decoded}-${Date.now()}.${ext}`);
//   }
// });
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

// exports.updateUserPhoto=upload.single('photo');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe=async (req,res,next)=>{
    // console.log(req.file)
    // console.log(req.body)
    const token = req.cookies.jwt;
    const decoded= jwt.verify(token, process.env.JWT_SECRET,(err,decoded)=>{return decoded.id})
    const currrentUser= await User.findById(decoded);
    res.locals.user=currrentUser;

    if (req.body.password || req.body.passwordConfirm) {
      res.status(400).json({message:"not able to upload here"})
    }
      
    

    const filteredBody = filterObj(req.body, 'name', 'email');
    console.log(req.file)
    if(req.file)
    {
      filteredBody.photo=req.file.filename;
      // console.log(filteredBody)
    }
    // console.log(res.File)
    const updatedUser = await User.findByIdAndUpdate(decoded,filteredBody, {
        new: true,
        runValidators: true
      });;

      res.status(200).json({data:updatedUser})
}