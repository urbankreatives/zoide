const mongoose = require('mongoose');


var passXSchema = new mongoose.Schema({


firstTerm:{type:Number, required:true},

secondTerm:{type:Number, required:true},

thirdTerm:{type:Number, required:true},

year:{type:Number, required:true},
companyId:{type:String, required:true},






})

module.exports = mongoose.model('PassX', passXSchema);