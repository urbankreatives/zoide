const mongoose = require('mongoose');


var incomeMonthSchema = new mongoose.Schema({



year:{type:Number, required:true},
month:{type:String, required:true},
amount:{type:Number, required:true},
companyId:{type:String, required:true},





})

module.exports = mongoose.model('MonthIncome', incomeMonthSchema);