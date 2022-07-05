const mongoose = require("mongoose");

const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "you must give a valid name"] },
  email: {
    type: String,
    required: [true, "you must give email adress"],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, " valid mail id is required"],
  },
  phoneNumber:{type:Number,
  min:10,
  unique:[true,"the m\number is already exists"],

required:[true,"please give your contact number"]},

  photo:{type:String,
  default:"default.png"} ,
  roles: {
    type: String,
    default: "member",
    enum: ["member", "evaluator", "mentor"],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "password should have 8 charecters"],
  },
  confirmPassword: {
    type: String,
    required: [true, "please put the password to confirm"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
 
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordRestToken = async function () {
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    // console.log({resetToken}
    //      ,this.passwordResetToken
        // );

     this.passwordResetExpires=Date.now()+10*60*1000;
     

    // console.log(this.passwordResetExpires=Date.now()+600000-time);
    return resetToken;
};

userSchema.pre('save',function (next){
  if(!this.isModified('password')||this.isNew)
  {
    return next();
  }
  this.passwordChangedAt=Date.now()-1000;
  next();

})

// userSchema.virtual('post', {
//   ref: 'Post',
//   foreignField: 'expert',
//   localField: '_id'
// });

const User = mongoose.model("User", userSchema);
module.exports = User;
