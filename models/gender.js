const mongoose = require('mongoose');


var genderSchema = new mongoose.Schema({


male:{type:Number, required:true},
female:{type:Number, required:true},
companyId:{type:String, required:true},





})

module.exports = mongoose.model('Gender', genderSchema);