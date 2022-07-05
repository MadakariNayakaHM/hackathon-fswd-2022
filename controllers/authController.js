const User=require('./../models/userModel');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const { promisify } = require("util");
const crypto=require('crypto');
const { fail } = require('assert');
const Email=require('../email')
const token = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};


const createSendToken = (user,  res) => {
    const Token =token(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      Secure:true,
    };
    
  
    res.cookie('jwt', Token, cookieOptions);
}

exports.signup= async (req,res,next)=>{
    try
    {
    const newuser= await User.create(req.body)
    // console.log(newuser._id)
    const userToken= token(newuser._id);
    createSendToken(newuser,res);
    // console.log(userToken);
    const url=`${req.protocol}://${req.get('host')}/login`
    // await new Email(newuser,url).sendWelcome();
    res.status(200).json({status:'success',token:userToken,data:newuser});
    }
    catch (err){res.status(404).json({status:'fail',message:"bad gate way"})
console.log(err)}
}

exports.login = async (req, res, next) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      if (!email || !password) {
        res
          .status(401)
          .json({ status: "fail", message: "invalid email or password" });
      }
  
      const user = await User.findOne({ email: email }).select("+password");
  
      if (!user || !(await user.correctPassword(password, user.password))) {
        res
          .status(404)
          .json({ status: "fail", message: "invalid emai or password" });
      }
      createSendToken(user,res);
       const Token = token(user._id);
      res.status(200).json({ status: "success", Token });
    
    } catch (err) {
      console.log(err);
    }
  };

  exports.protect = async (req, res, next) => {
  let token;
  try {
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if(req.cookies.jwt){
      token=req.cookies.jwt;
    }

    if (!req.cookies.jwt)
    {
      res.status(404).json({ status: "fail", message: "login 1st" });
    }

    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    ).catch((err) => {
      res.status(401).json({ message: "expired token!!!" });
    });
    const idUser = jwt.verify(req.cookies.jwt,process.env.JWT_SECRET,(err,decoded)=>{return decoded.id})
    const currentUser= await User.findById(idUser);
    res.locals.user = currentUser
   
    // const decoded=jwt.verify(token,process.env.JWT_SECRET,function(err,decoded){return decoded.id});

    next();
  } catch (err) {
    console.log(err);
  }
};
// only to render error
// exports.isLoggedIn = async (req, res, next) => {
//   if (req.cookies.jwt) {
//     try {
//       // 1) verify token
//       const decoded = await promisify(jwt.verify)(
//         req.cookies.jwt,
//         process.env.JWT_SECRET
//       );

//       // 2) Check if user still exists
//       const currentUser = await User.findById(decoded.id);
//       if (!currentUser) {
//         return next();
//       }

      

//       // THERE IS A LOGGED IN USER
//       res.locals.user = currentUser;
//       return next();
//     } catch (err) {
//       return next();
//     }
//   }
//   next();
// };
exports.forgetPassword = async (req, res, next) => {      
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }

    const resetToken = await user.createPasswordRestToken();
    console.log(resetToken)
    await user.save({ validateBeforeSave: false });

const resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

const message=`forget your pssword click here ${resetURL}`

// try{
//   await sendEmail({
//   email:user.email,
//   subject:`your password reset token is valid for 10 min`,
//   message
// });

// res.status(200).json({
//   status:'success',
//   message:'token sent to email',
  
// })} catch (err){
//   user.passswordResetToken=undefined;
//   user.passwordResetExpires=undefined;
//   await user.save({ validateBeforeSave: false });
//   // await User.save({validateBeforeSave:false});
//   console.log(err);
//   res.status(500).json({message:'error sending email'});

// }
// // next();
  } catch (err) {
    console.log(err);
  }
};

exports.resetPassword= async (req,res,next)=>{
  try{const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user=await User.findOne({passwordResetToken:hashedToken})
  console.log(user)
  
  if(!user)
  {
    res.status(404).json({message:"user token is invalid or expired"});
  }
  
  user.password=req.body.password;
  user.confirmPassword=req.body.confirmPassword;
  user.passwordResetExpires=undefined;
  user.passwordResetToken=undefined;
  await user.save();
  const token=token(user._id);
  res.status(200).json({status:'success',
  token})
  createSendToken(user,res);
}catch (err){console.log(err)}}

exports.users= async (req,res,next)=>
{
const user =await User.find();
res.status(200).json({status:'success',data:user})
}

exports.ristrictTo = (...roles) => {
  try {
    return async (req, res, next) => {
      let token;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        res.status(404).json({ status: "fail", message: "login 1st" });
      }

    else  if (!req.cookies.jwt)
    {
      res.status(404).json({ status: "fail", message: "login 1st" });
    }

      let decoded = jwt.verify(
        req.cookies.jwt,
        process.env.JWT_SECRET,
        function (err, decoded) {
          return decoded.id;
        }
      );
      let user = await User.findById(decoded);
      // console.log(user);
      console.log(user.roles);
      if (!roles.includes(user.roles)) {
        res.status(401).json({ message: "you are not authenticated" });
      }
      next();
    };
  } catch (err) {
    console.log(err);
  }
};