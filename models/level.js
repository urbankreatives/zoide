const mongoose = require('mongoose');


var levelSchema = new mongoose.Schema({



grade:{type:Number, required:true},
levelX:{type:String, required:true},
companyId:{type:String, required:true}





})

module.exports = mongoose.model('Level', levelSchema);