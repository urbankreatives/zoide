const mongoose = require('mongoose');


var calendarSchema = new mongoose.Schema({


title:{type:String, required:true},
start:{type:String, required:true},
end:{type:String, required:true},
className:{type:String},
userRole:{type:String, required:true},
companyId:{type:String, required:true},


})

module.exports = mongoose.model('Calendar', calendarSchema);