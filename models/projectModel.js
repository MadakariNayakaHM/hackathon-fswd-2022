const mongoose = require('mongoose') ;
const projectSchema = new mongoose.Schema({
    projectName:String,
    mentor:String,
    members:[String],
    grade:{
        type:Number,
        default:3,
        min:3,
        Max:10,
    },
    protoType:String
})

const project = mongoose.model('project', projectSchema);
module.exports=project;