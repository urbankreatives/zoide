var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
   
 

    senderId: {type: String, required: true},
    senderName: {type: String, required: true},
    senderPhoto: {type: String, required: true},
    msgId: {type: String, required: true},
    msg: {type: String, required: true},
    senderEmail: {type: String, required: true},
    status: {type: String, required: true},
    status4: {type: String, required: true},
    status5: {type: String, required: true},
    numDate: {type: Number, required: true},
    type: {type: String, required: true},
    subject:{type:String,required:true},
    date:{type:String,required:true},

 
});

module.exports = mongoose.model('Message', schema);