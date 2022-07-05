const notify= require('./../models/notificationModel');
const User= require('./../models/userModel');

exports.createNotification= async (req,res,next)=>
{
    
    const newNotify= await notify.create(req.body);
    res.status(200).json({status:"success",
       project: newNotify});
       next()

}

exports.getAllnotifications = async (req,res,next)=>
{
    const notifications= await notify.find();
    res.status(200).json({status:"success",
    notifications});
    next()
}
exports.updateNotifications =async (req,res,next)=>{
const updatedProject=await notify.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
res.status(201).json({status:"success",
data:updatedProject});
next()
}

exports.deleteNotification= (req,res,next)=>
{
    notify.findByIdAndDelete(req.body.delete);
    res.status(204).json({status:"success",
    data:null});
    next()
}