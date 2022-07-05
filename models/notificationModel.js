const mongoose = require('mongoose') ;
const notificationSchema = new mongoose.Schema({
    notification:String
})

const notification = mongoose.model('notification', notificationSchema);
module.exports=notification;